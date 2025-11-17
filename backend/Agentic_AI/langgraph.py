


import os
from getpass import getpass
from langchain_community.chat_models import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
prev_assistant_message = None
initial_state = None
from langchain_core.prompts import PromptTemplate # Corrected import

import json
from langchain_openai import ChatOpenAI
import glob
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, tools_condition, create_react_agent

# Retrieve the API key from Colab's user data
openai_api_key = os.getenv('OPENAI_API_KEY')

# Set the API key as an environment variable
os.environ['OPENAI_API_KEY'] = openai_api_key

model_chatbot = ChatOpenAI(model="gpt-4o", temperature=0)
model_scrute = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_extractor = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_planner= ChatOpenAI(model="gpt-4o-mini", temperature=0)

embeddings = OpenAIEmbeddings()
vector_store = InMemoryVectorStore(embeddings)

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
## System Propmt chatbot
system_prompt_chatbot = SystemMessage(content='''
You are NestWise, a financial planning assistant.
You must ONLY talk about retirement and personal finance.
If the user asks about unrelated topics (e.g., cooking, movies), politely redirect back:
"I can’t provide recipes, but I can help you estimate your retirement savings instead."
''')

## extractor
system_prompt_extract = SystemMessage(content='''
You will be analyzing the conversation history between a user and a chatbot about retirement planning.
''')

## Summarizer
system_prompt_summarize = SystemMessage(content='''
You are a helpful assistant that summarizes conversations about retirement planning.
Summarize the following conversation and the extracted user profile information.
Focus on the user's retirement goal, the financial information collected (age, savings, salary, location), and any potential next steps discussed.
Present the summary clearly and concisely.
''')

from typing import Literal
from langgraph.graph import MessagesState
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

# State class to store messages
class ChatbotState(MessagesState):
  shadow_profile: dict

class ExtractorState(MessagesState):
  real_profile: dict
  shadow_profile: dict
  all_fields_filled: bool

class SummarizerState(MessagesState):
  summary: str

class PlannerState(MessagesState):
    real_profile: dict

class MasterState(MessagesState):
  chatbot: dict
  extractor: dict
  summarizer: dict
  real_profile: dict
  shadow_profile: dict
  planner: dict

from typing import Literal
from langgraph.graph import MessagesState
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

## To call agent chatbot

def call_chatbot(state: ChatbotState):
  shadow_system_prompt = f"""
  Below is a dictionary representing the user's information.
  Each key corresponds to a data field, and each value indicates whether the information has already been collected:{state.get("shadow_profile", {})}

  Your task is to decide what the chatbot should ask the user next.
   - If the "goal" field is false, the chatbot should prompt the user to share their retirement goal (e.g., early retirement, financial security, travel, etc.).
   - If the "goal" field is true, the chatbot should ask about exactly one other field from the dictionary that is still false.

  Return only the next message the chatbot should send to the user — no explanations, no JSON, and no extra text.
  """

  state["messages"] = [system_prompt_chatbot] + [SystemMessage(content=shadow_system_prompt)] + state["messages"]
  response = model_chatbot.invoke(state["messages"])
  state['messages'] = state['messages'] + [response]
  return state

# To call extractor
def call_extractor(state: ExtractorState):
  shadow_system_prompt = f"""
  Below is a dictionary representing the user's information.
  Each key corresponds to a data field, and each value indicates whether the information has already been collected:{state.get("shadow_profile", {})}

  Your task is to:
  1. Examine the conversation history that follows.

  2. For every field, check if the user has provided information that can fill that field. Update if necessary

  3. If the user has supplied the missing information, extract it accurately.

  4. If the user has supplied the information to update the true fields, exrtact the new value and update it.

  Respond only with a JSON object containing ONLY the previously false fields that you can now populate, using this exact structure:
  {{
    "fieldName1" : fieldValue1,
    "fieldName2" : fieldValue2,
    ...
  }}

  If no new information is found, return an empty JSON object: {{}}.
  Do not include explanations, reasoning, or extra text outside the JSON.
  """
  state["messages"] = [system_prompt_extract] + [SystemMessage(content=shadow_system_prompt)] + state["messages"]
  response = model_extractor.invoke(state["messages"])
  
  print(f"Extractor response: {response.content}")
  response_dict = json.loads(response.content)
  shadow_profile = state.get("shadow_profile", {})
  real_profile = state.get("real_profile", {})

  if not response_dict:
    return

  common_keys = response_dict.keys() & shadow_profile.keys()

  for key in common_keys:
    shadow_profile[key] = True

  real_profile.update(response_dict)
  boolValue = all(value is True for value in shadow_profile.values())
  state["all_fields_filled"] = boolValue
  state["real_profile"] = real_profile
  state["shadow_profile"] = shadow_profile
  print(f"New shadow profile {shadow_profile}")
  return state

## To call RAG Agent
def query_or_respond(state: PlannerState):
    rag_query = (
      "Based on the user's retirement profile, provide a comprehensive retirement plan using the loaded PDF knowledge.\n\n"
      f"User Profile:\n{state.get('real_profile')}\n\n"
      "Your plan should include:\n"
      "1) A detailed personalized summary of their retirement outlook, considering their age, savings, salary, and location (where applicable).\n"
      "2) At least five specific and actionable next steps tailored to their profile.\n"
      "3) A comprehensive list of potential risks and important notes relevant to their situation.\n\n"
      "Ensure the plan is well-structured and easy to understand.\n\n"
      "Include a line: 'This is educational and not financial advice.'\n"
  )
    state["messages"] =  [SystemMessage(rag_query)] + state["messages"]
    model_planner_with_tools = model_planner.bind_tools([retrieve])
    response = model_planner_with_tools.invoke(state["messages"])
    return {"messages": [response]}

## to Call Summarizer
def call_summarizer(state: SummarizerState):
  state["messages"] = [system_prompt_summarize] + state["messages"]
  response = model_extractor.invoke(state["messages"])
  return {"summary": response.content}

# To Call Planner to give final resposnse
def call_planner(state: PlannerState):
  
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
                "Always cite the sources (filename and page) at the end of each fact you use. "
                "If you don't know the answer, say that you don't. Keep it concise."
                f"\n\n{docs_content}"
            )
            
            state["messages"] =  [SystemMessage(system_message_content)] + state["messages"]
            response = model_planner.invoke(state["messages"])
            return {"messages": [response]}

## to decide to call the planner agent.
def route_decision_extractor(state: MasterState) -> str:
  profile_filled = state.get("extractor").get("all_fields_filled")
  if profile_filled:
    return "planner"
  else:
    return "chatbot"

def route_decision_summarize(state: MasterState) -> str:
  messages_count = len(state.get("chatbot").get("messages"))
  if messages_count >= 10:
    return "summarizer"
  else:
    return "__end__"

## RAG Implementation

# ---- Load PDFs from Google Drive folder ----
pdf_folder = "./retirement_pdfs"  # Update with your folder path
pdf_files = glob.glob(f"{pdf_folder}/*.pdf")

loaded_docs = []
for file_path in pdf_files:
    try:
        loader = PyPDFLoader(file_path)
        pages = loader.load()   # returns one Document per page
        loaded_docs.extend(pages)
    except Exception as e:
        print(f"Failed to load {file_path}: {e}")

# Split docs into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=150)
splits = splitter.split_documents(loaded_docs)

# Add to vector store
_ = vector_store.add_documents(documents=splits)

# Define retriever tool
@tool(response_format="content_and_artifact")
def retrieve(query: str):
    """Retrieve information related to a query from the vector store."""
    retrieved_docs = vector_store.similarity_search(query, k=3)
    formatted_snippets = []
    for doc in retrieved_docs:
        meta = getattr(doc, "metadata", {})
        source = meta.get("source", "Unknown source")
        print("Doc source:", source)
        page = meta.get("page", "N/A")
        formatted_snippets.append(
            f"Source: {os.path.basename(source)}, Page: {page}\n"
            f"Content:\n{doc.page_content.strip()}"
        )
    

    serialized = "\n\n---\n\n".join(formatted_snippets)
    return serialized, retrieved_docs




## Graph for RAG 

memory = MemorySaver()
tools_node = ToolNode([retrieve])
# Chatbot (persistent)
chatbot_graph = StateGraph(ChatbotState)
chatbot_graph.add_node("chatbot", call_chatbot)
chatbot_graph.add_edge(START, "chatbot")
chatbot_subgraph = chatbot_graph.compile(checkpointer=memory)

# Summarizer
summarizer_graph = StateGraph(SummarizerState)
summarizer_graph.add_node("summarizer", call_summarizer)
summarizer_graph.add_edge(START, "summarizer")
summarizer_subgraph = summarizer_graph.compile()

# Extractor (stateless)
extractor_graph = StateGraph(ExtractorState)
extractor_graph.add_node("extractor", call_extractor)
extractor_graph.add_edge(START, "extractor")
extractor_subgraph = extractor_graph.compile()

## Planner
planner_graph = StateGraph(PlannerState)
planner_graph.add_node(query_or_respond)
planner_graph.add_node(tools_node)
planner_graph.add_node(call_planner)
planner_graph.set_entry_point("query_or_respond")
planner_graph.add_conditional_edges(
    "query_or_respond", tools_condition, {END: END, "tools": "tools"}
)
planner_graph.add_edge("tools", "call_planner")
planner_graph.add_edge("call_planner", END)
planner_subgraph = planner_graph.compile(checkpointer=memory)

### Functions to run individual graphs

def run_chatbot(master_state: MasterState):
  chatbot_data = master_state.get("chatbot", {})
  shadow_profile = master_state.get("shadow_profile", {})
  chatbot_data["shadow_profile"] = shadow_profile
  chatbot_state = ChatbotState(**chatbot_data)

  all_messages = master_state.get("messages", [])
  human_messages = [m for m in all_messages if m.type == "human"][-1:]  # last human message
  last_human = human_messages[-1:] if human_messages else []

  if chatbot_state:
    chatbot_state["messages"] = chatbot_state["messages"] + last_human
  else:
    chatbot_state["messages"] = last_human

  chatbot_state = chatbot_subgraph.invoke(chatbot_state)

  master_state["chatbot"] = dict(chatbot_state)
  master_state["shadow_profile"] = chatbot_state.get("shadow_profile", {})
  return master_state

def run_extractor(master_state: MasterState):
  extractor_data = master_state.get("extractor", {})
  chatbot_data = master_state.get("chatbot", {})
  shadow_profile = master_state.get("shadow_profile", {})
  real_profile = master_state.get("real_profile", {})
  extractor_data["shadow_profile"] = shadow_profile
  extractor_state = ExtractorState(**extractor_data)
  chatbot_state = ChatbotState(**chatbot_data)

  # Get the last human message from the master conversation
  all_messages = master_state.get("messages", [])
  human_messages = [m for m in all_messages if m.type == "human"][-1:]  # last human message
  last_human = human_messages[-1:] if human_messages else []

  # Get the last message that the chatbot sent to the user
  chatbot_messages = [
        m for m in chatbot_state.get("messages", []) if m.type in ("ai", "system")
  ]
  last_chatbot = chatbot_messages[-1] if chatbot_messages else AIMessage(content="NO CHATBOT MESSAGES FOUND")
  
  # Combine for the extractor's current processing
  extractor_state["messages"] = [HumanMessage(content=last_chatbot.content)] + last_human

  extractor_state = extractor_subgraph.invoke(extractor_state)

  master_state["extractor"] = dict(extractor_state)
  master_state["real_profile"] = extractor_state.get("real_profile", {})
  master_state["shadow_profile"] = extractor_state.get("shadow_profile", {})
  return master_state

### to run summarizer
def run_summarizer(master_state: MasterState):
  summarizer_data = master_state.get("summarizer", {})
  chatbot_data = master_state.get("chatbot", {})
  summarizer_state = SummarizerState(**summarizer_data)
  chatbot_state = ChatbotState(**chatbot_data)

  chatbot_messages = [
      m for m in chatbot_state.get("messages", [])
  ]

  summarizer_state["messages"] = [HumanMessage("Last Summary:" + summarizer_state.get("summary", "None"))] + chatbot_messages
  
  # Run the summarizer subgraph
  summarizer_state["summary"] = summarizer_subgraph.invoke(summarizer_state)["summary"]
  chatbot_state["messages"] = [system_prompt_chatbot] + [HumanMessage("Summary:" + summarizer_state["summary"])] + chatbot_messages[-1:]
  master_state["summarizer"] = dict(summarizer_state)
  master_state["chatbot"] = dict(chatbot_state)
  return master_state

def run_planner(master_state: MasterState):
    planner_data = master_state.get("planner", {})
    real_profile = master_state.get("real_profile", {})
    planner_data["real_profile"] = real_profile
    planner_state = PlannerState(**planner_data)
    planner_state=planner_subgraph.invoke(planner_state)
    master_state["planner"] = dict(planner_state)
    return master_state

# Final Master Graph
workflow = StateGraph(MasterState)

workflow.add_node("chatbot", run_chatbot)
workflow.add_node("extractor", run_extractor)
workflow.add_node("planner", run_planner)
workflow.add_node("summarizer", run_summarizer)

workflow.add_edge(START, "extractor")

workflow.add_conditional_edges(
    "extractor",
    route_decision_extractor,
    {
        "planner": "planner",
        "chatbot": "chatbot",
    },
)

workflow.add_conditional_edges(
    "chatbot",
    route_decision_summarize,
    {
        "summarizer": "summarizer",
        "__end__": "__end__",
    },
)

workflow.add_edge("planner", END)

graph = workflow.compile()

initialMessage = 'Hello! I am NestWiseAI. How can I help you today?'
def start_session(session_id: str):
    """
    Initialize a new session and store its MasterState in the global sessions dict.
    """
    global state
    state = MasterState(
        messages=[],
        chatbot={"messages": [AIMessage(content=initialMessage)]},
        planner={"messages": []},
        extractor={"all_fields_filled": False},
        real_profile={},  # <-- this is what /profile will update
        shadow_profile={
            "goal": False,
            "age": False,
            "savings": False,
            "salary": False,
            "location": False
        }
    )
    return session_id


def chat_step(user_message: str, session_id: str):
    if user_message:
        human_message = HumanMessage(content=user_message)
    else:
        human_message = None
    
    global state
    global prev_assistant_message

    # Run the graph
    state["messages"].append(human_message)
    state = graph.invoke(state)

    # Print the assistant's reply
    assistant_message = state['chatbot']['messages'][-1]
    
    if assistant_message == prev_assistant_message:
        planner_message = state['planner']['messages'][-1]
        response_text = planner_message.content
    else:
        response_text = assistant_message.content
        prev_assistant_message = assistant_message

    # Always include the latest real_profile
    profile_data = state.get("real_profile", {})

    return {
        "response": response_text,
        "real_profile": profile_data
    } 