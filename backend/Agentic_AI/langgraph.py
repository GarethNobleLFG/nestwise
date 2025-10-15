# ---- Imports ----
import os, getpass, time, traceback, glob
from typing import Dict


import openai


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY not found in environment. Set it in Docker (env_file / env) "
        "or pass as a secret. Example: `OPENAI_API_KEY=sk-... docker compose up`"
    )

openai.api_key = OPENAI_API_KEY

# ---- LangChain / LangGraph setup ----
use_langgraph = True
try:
    from langchain_openai import ChatOpenAI, OpenAIEmbeddings
    #from langchain_unstructured import UnstructuredLoader
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_core.vectorstores import InMemoryVectorStore
    from langchain_core.documents import Document
    from langchain_core.messages import SystemMessage
    from langchain_core.tools import tool
    from langgraph.graph import MessagesState, StateGraph, END
    from langgraph.prebuilt import ToolNode, tools_condition, create_react_agent
    from langgraph.checkpoint.memory import MemorySaver
except Exception as e:
    print("Could not import LangGraph/LangChain components")
    print("Import error:", e)
    use_langgraph = False

# ---- If LangGraph available: build vector store from PDFs ----
vector_store = None
llm = None
agent_executor = None
graph = None
memory = None

if use_langgraph:
    try:
        # Initialize LLM + embeddings
        llm = ChatOpenAI(model="gpt-4o-mini")
        embeddings = OpenAIEmbeddings()
        vector_store = InMemoryVectorStore(embeddings)

        # ---- Load PDFs from Google Drive folder ----
        pdf_folder = "/retirement_pdfs"
        pdf_files = glob.glob(f"{pdf_folder}/*.pdf")

        loaded_docs = []
        for file_path in pdf_files:
            try:
                loader = PyPDFLoader(file_path)
                pages = loader.load()   # returns one Document per page
                loaded_docs.extend(pages)
                print(f"Loaded {file_path} -> {len(pages)} pages")
            except Exception as e:
                print(f"Failed to load {file_path}: {e}")

        #THIS IS USED IF PDF FILES ARE IMAGE BASED AND NOT TEXTBASED
        # loaded_docs = []
        # for file_path in pdf_files:
        #     try:
        #         loader = UnstructuredLoader(
        #             file_path=file_path,
        #             strategy="hi_res"   # enables OCR + layout parsing
        #         )
        #         docs = list(loader.lazy_load())  # returns Document objects
        #         loaded_docs.extend(docs)
        #         print(f"Loaded {file_path} -> {len(docs)} structures")
        #     except Exception as e:
        #         print(f"Failed to load {file_path}: {e}")

        # Split docs into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=150)
        splits = splitter.split_documents(loaded_docs)

        # Add to vector store
        _ = vector_store.add_documents(documents=splits)
        print("Added PDF documents to InMemoryVectorStore. Total chunks:", len(splits))

        # Define retriever tool
        @tool(response_format="content_and_artifact")
        def retrieve(query: str):
            """Retrieve information related to a query from the vector store."""
            retrieved_docs = vector_store.similarity_search(query, k=3)
            serialized = "\n\n".join(
                (f"Source: {getattr(doc, 'metadata', {})}\nContent: {doc.page_content}")
                for doc in retrieved_docs
            )
            return serialized, retrieved_docs

        # Build LangGraph flow
        graph_builder = StateGraph(MessagesState)

        def query_or_respond(state: MessagesState):
            llm_with_tools = llm.bind_tools([retrieve])
            response = llm_with_tools.invoke(state["messages"])
            return {"messages": [response]}

        tools_node = ToolNode([retrieve])

        def generate(state: MessagesState):
            recent_tool_messages = []
            for message in reversed(state["messages"]):
                if message.type == "tool":
                    recent_tool_messages.append(message)
                else:
                    break
            tool_messages = recent_tool_messages[::-1]
            docs_content = "\n\n".join(doc.content for doc in tool_messages)
            system_message_content = (
                "You are an assistant for question-answering tasks. "
                "Use the following pieces of retrieved context to answer the question. "
                "If you don't know the answer, say that you don't. Keep it concise."
                f"\n\n{docs_content}"
            )
            conversation_messages = [
                message
                for message in state["messages"]
                if message.type in ("human", "system")
                or (message.type == "ai" and not message.tool_calls)
            ]
            prompt = [SystemMessage(system_message_content)] + conversation_messages
            response = llm.invoke(prompt)
            return {"messages": [response]}

        # Assemble graph
        graph_builder.add_node(query_or_respond)
        graph_builder.add_node(tools_node)
        graph_builder.add_node(generate)
        graph_builder.set_entry_point("query_or_respond")
        graph_builder.add_conditional_edges(
            "query_or_respond", tools_condition, {END: END, "tools": "tools"}
        )
        graph_builder.add_edge("tools", "generate")
        graph_builder.add_edge("generate", END)

        memory = MemorySaver()
        graph = graph_builder.compile(checkpointer=memory)

        agent_executor = create_react_agent(llm, [retrieve], checkpointer=memory)
       
        print("LangGraph + RAG pipeline built successfully.")
    except Exception as e:
        print("Error building LangGraph RAG pipeline:", e)
        traceback.print_exc()
        use_langgraph = False

# ---- Guided Questionnaire ----
questions = [
    "What is your age?",
    "What is your current annual income (USD)?",
    "How much have you already saved for retirement (USD)?",
    "What percentage of your income do you currently contribute to your 401(k)? (e.g., 5)",
    "Does your employer match contributions? If yes, what is the match (e.g., 50% up to 6%)? If no, say 'no'.",
    "How would you describe your risk tolerance? (Low, Medium, High)",
    "What is your planned retirement age?"
]

SESSION_STATE: Dict[str, dict] = {}

def start_session(session_id: str):
    SESSION_STATE[session_id] = {"current_q": 0, "responses": {}}

def run_rag(query: str, thread_id: str = None) -> str:
    if use_langgraph and graph is not None:
        try:
            config = {"configurable": {"thread_id": thread_id or f"thread-{int(time.time()*1000)}"}}
            last_content = None
            for step in graph.stream({"messages": [{"role": "user", "content": query}]}, stream_mode="values", config=config):
                msg = step["messages"][-1]
                try:
                    last_content = getattr(msg, "content", None) or getattr(msg, "text", None) or str(msg)
                except Exception:
                    last_content = str(msg)
            if last_content:
                return last_content
        except Exception as e:
            print("Graph run failed. Error:", e)
            traceback.print_exc()

# ---- Chat handler ----
def chat_step(user_message: str, history, session_id=None):
    if session_id is None:
        session_id = str(time.time())

    if session_id not in SESSION_STATE:
        start_session(session_id)

    state = SESSION_STATE[session_id]
    q_index = state["current_q"]

    if user_message is not None and user_message.strip() != "":
        state["responses"][questions[q_index]] = user_message.strip()
        q_index += 1
        state["current_q"] = q_index

    if q_index < len(questions):
        next_q = questions[q_index]
        return next_q, history + [[user_message, next_q]]

    profile_lines = [f"{k}: {v}" for k, v in state["responses"].items()]
    profile_text = "\n".join(profile_lines)
    rag_query = (
        "User retirement profile:\n\n"
        f"{profile_text}\n\n"
        "Using the loaded PDF knowledge, provide:\n"
        "1) A concise personalized summary of their 401(k) outlook (3-6 sentences).\n"
        "2) Three clear next steps (actionable).\n"
        "3) Short risks/notes.\n\n"
        "Include a line: 'This is educational and not financial advice.'\n"
    )

    summary = run_rag(rag_query, thread_id=f"session-{session_id}")
    SESSION_STATE.pop(session_id, None)

    final_output = f"Here’s your personalized 401(k) summary:\n\n{summary}"
    return final_output, history + [[user_message, final_output]]