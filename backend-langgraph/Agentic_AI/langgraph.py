# backend_langgraph/Agentic_AI/langgraph.py
import os
from getpass import getpass
from langchain_community.chat_models import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate # Corrected import
import json
from langchain_openai import ChatOpenAI
import glob
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, tools_condition, create_react_agent
from datetime import date

COMPLETENESSRATIO = 1.0

# Retrieve OpenAI API key securely
openai_api_key = os.getenv('OPENAI_API_KEY')

# Set the API key as an environment variable
os.environ['OPENAI_API_KEY'] = openai_api_key

model_chatbot = ChatOpenAI(model="gpt-4o", temperature=0)
model_summarizer = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_matcher = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_extractor = ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_planner= ChatOpenAI(model="gpt-4o-mini", temperature=0)
model_query_rewriter = ChatOpenAI(model="gpt-4o-mini", temperature=0)

embeddings = OpenAIEmbeddings()
vector_store = InMemoryVectorStore(embeddings)

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

##### CHATBOT PROMPT #####
system_prompt_chatbot = SystemMessage(content='''
You are NestWise, a financial planning assistant.
You must ONLY talk about retirement and personal finance.
If the user asks about unrelated topics (e.g., cooking, movies), politely redirect back:
"I can’t provide recipes, but I can help you estimate your retirement savings instead."
You will be given a Python dictionary representing the user's information.

Your task is to decide what the chatbot should ask the user next.
  - If the "goal" field is false, the chatbot should prompt the user to share their retirement goal (e.g., early retirement, financial security, travel, etc.).
  - If the "goal" field is true, the chatbot should ask about exactly one other field from the dictionary that is still false.

Return only the next message the chatbot should send to the user — no explanations, no JSON, and no extra text.
''')

##### CHATBOT PROMPT #####
system_prompt_chatbot_ask_for_updates = SystemMessage(content='''
You are NestWise, a financial planning assistant.
You must ONLY talk about retirement and personal finance.
If the user asks about unrelated topics (e.g., cooking, movies), politely redirect back:
"I can’t provide recipes, but I can help you estimate your retirement savings instead."

In some variation, ask the user if they want to continue
to update their profile information before generating a new plan.

Return only the next message the chatbot should send to the user — no explanations, no JSON, and no extra text.
''')



##### SUMMARIZER PROMPT #####
system_prompt_summarize = SystemMessage(content='''
You are a helpful assistant that summarizes conversations about retirement planning.
Summarize the following conversation and the extracted user profile information.
Present the summary clearly and concisely. Do Not Specify Next Steps.
''')



##### EXTRACTOR PROMPT #####
system_prompt_extract = SystemMessage(content='''
You will be analyzing the conversation history between a user and a chatbot about retirement planning.
''')

extractor_special_role_normal = SystemMessage(content='''
SPECIAL RULES about skipped or refused answers:
- If the user indicates they do not know the answer, are unsure, refuse to answer,
  or ask to skip a field, treat the field as answered and assign it a placeholder value:
  "unknown". Else, the field is still missing.
- Examples include: "I don't know", "not sure", "I'd rather not answer", "skip",
  "I prefer not to say", "I don't remember".
''')

extractor_special_role_update = SystemMessage(content='''
SPECIAL RULES:
- If the user responds with "no", or something suggesting that they are DONE, OR that they do NOT
want to update any other fields, return a field called 'continue_asking' with a value of False.
- Examples include: "no", "i'm good", "I'm done", "that's all", etc.
''')



##### MATCHER PROMPT #####
prompt_infos = {
    "spend": {
        "description":
            """
            Match when the user expresses a desire to:
            - enjoy their money
            - travel
            - spend down their savings
            - maximize lifestyle or comfort
            - use their money now rather than preserve it
            Keywords/concepts: travel, enjoy retirement, spend savings, lifestyle, experiences.
            """,
        "questions": {
            "retirement_age": {"collected": False, "importance": 5, "status":"missing"},
            "desired_monthly_spending": {"collected": False, "importance": 5, "status":"missing"},
            "large_planned_expenses": {"collected": False, "importance": 4, "status":"missing"},
            "travel_frequency": {"collected": False, "importance": 3, "status":"missing"},
            "lifestyle_upgrades": {"collected": False, "importance": 2, "status":"missing"}
            }
    },
    "leave": {
        "description":
            """
            Match when the user expresses a desire to:
            - leave money to children or family
            - provide financial security after their passing
            - preserve or grow assets for beneficiaries
            - build generational wealth
            Keywords/concepts: inheritance, family security, legacy, beneficiaries.
            """,
        "questions": {
            "number_of_beneficiaries": {"collected": False, "importance": 5, "status":"missing"},
            "beneficiary_relationships": {"collected": False, "importance": 4, "status":"missing"},
            "inheritance_goal_amount": {"collected": False, "importance": 5, "status":"missing"},
            "estate_distribution_preferences": {"collected": False, "importance": 3, "status":"missing"},
            "life_insurance_status": {"collected": False, "importance": 2, "status":"missing"}
        }
    },
    "save": {
        "description":
            """
            Match when the user expresses a desire to:
            - maintain or preserve their wealth
            - minimize financial risk
            - ensure savings last throughout retirement
            - live within a stable, predictable budget
            Keywords/concepts: stability, long-term planning, low risk, budgeting, preservation.
            """,
        "questions": {
            "retirement_age": {"collected": False, "importance": 4, "status":"missing"},
            "expected_monthly_expenses": {"collected": False, "importance": 5, "status":"missing"},
            "risk_tolerance": {"collected": False, "importance": 4, "status":"missing"},
            "healthcare_budget": {"collected": False, "importance": 5, "status":"missing"},
            "social_security_start_age": { "collected": False, "importance": 3, "status":"missing"}
        }
    },
    "donate": {
        "description":
            """
            Match when the user expresses a desire to:
            - give money to charity
            - donate part of their estate
            - support a cause or organization
            - engage in philanthropy
            Keywords/concepts: charity, nonprofit, giving back, donation, philanthropy.
            """,
        "questions": {
            "charity_names": {"collected": False, "importance": 4, "status":"missing"},
            "donation_goal_amount": {"collected": False, "importance": 5, "status":"missing"},
            "donation_frequency": {"collected": False, "importance": 3, "status":"missing"},
            "planned_donation_time_period": {"collected": False, "importance": 4, "status":"missing"},
            "legacy_donation_percentage": {"collected": False, "importance": 2, "status":"missing"}
        }
    },
    "default": {
        "description": "Used when the goal does not fit any category clearly.",
        "questions": {
            "retirement_age": {"collected": False, "importance": 4, "status":"missing"},
            "expected_monthly_expenses": {"collected": False, "importance": 5, "status":"missing"},
            "risk_tolerance": {"collected": False, "importance": 4, "status":"missing"},
            "healthcare_budget": {"collected": False, "importance": 5, "status":"missing"},
            "inheritance_goal_amount":{"collected": False, "importance": 3, "status":"missing"}
        }
    }
}

category_descriptions = "\n".join(
    [f"- {name}: {info['description']}" for name, info in prompt_infos.items()]
)



system_prompt_matcher = PromptTemplate.from_template(f"""
You are a retirement-goal classifier.

Given this retirement goal:
"{{user_goal}}"

You must classify the user's goal into one or more of these categories:

{category_descriptions}

Rules:
1. Prefer matching an existing category over default.
2. Use "default" only when the user's goal does not express any financial intention.
3. If the goal clearly fits multiple categories, return multiple categories.
4. Never give a secondary category a score equal to the primary. Secondary scores must always be lower.
5. Secondary categories should never be 'default'.
6. Respond in JSON format:
   {{{{
     "primary": "...",
     "secondary": "...",
     "scores": {{{{
       "spend": 0.0,
       "leave": 0.0,
       "save": 0.0,
       "donate": 0.0,
       "default": 0.0
     }}}}
   }}}}
""")

QUERY_REWRITE_SYSTEM = SystemMessage(content="""
    You are a financial document retrieval specialist.

    Your task is to rewrite user retirement planning questions into
    precise, technical retrieval queries suitable for searching:

    - IRS publications
    - Retirement tax law documents
    - Investment policy documents
    - Life expectancy tables
    - Contribution limit regulations

    Rules:
    1. Be specific and technical.
    2. Include regulatory terms if relevant.
    3. Include age thresholds (e.g., 59.5).
    4. Include jurisdiction (U.S.) when appropriate.
    5. Do NOT answer the question.
    6. Return ONLY the optimized retrieval query.
    """)

from typing import Literal,TypedDict
from langgraph.graph import MessagesState
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

real_profile = {}
"""
shadow_profile = {
    "goal" : False,
    "age" : False,
    "savings" : False,
    "salary" : False,
    "location" : False
}
"""

# State class to store messages
class ChatbotState(MessagesState):
   shadow_profile: dict
   chatbot_role: str

# Extractor State
class ExtractorState(MessagesState):
  real_profile: dict
  shadow_profile: dict
  all_fields_filled: bool
  updated_some_fields: bool
  extractor_role: str
  conversation_title: str

# Matcher State
class MatcherState(MessagesState):
  real_profile: dict
  shadow_profile: dict
  selected_template: str

# Summarizer State
class SummarizerState(MessagesState):
  real_profile: dict
  summary: str

# Planner state
class PlannerState(MessagesState):
  real_profile: dict
  shadow_profile: dict

# Master state for final graph
class MasterState(MessagesState):
  chatbot: dict
  extractor: dict
  summarizer: dict
  matcher: dict
  real_profile: dict
  shadow_profile: dict
  conversation_title: str
  planner: dict
  is_plan_generated: bool

# Routes
class RouterState(TypedDict):
    messages: list
    chosen_route: str
    result: str
    user_goal: str

from typing import Literal
from langgraph.graph import MessagesState
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

## To call agent chatbot

def normalize_collected(value):
    """Return True only for explicit True; accept some string booleans."""
    if value is True:
        return True
    if isinstance(value, str):
        v = value.strip().lower()
        if v in ("true", "yes", "1"):
            return True
        return False
    return False  # everything else -> not collected


## Removed formatting from profile prompt:
"""
  ## Response Format Requirements:
    - Use **markdown formatting** with headers, bullet points, and emphasis
    - Structure your response with clear sections using `##` or `###` headers
    - Use **bold** for important terms and *italics* for emphasis
    - Include bullet points (`-` or `*`) for lists
    - Use `>` for important callouts or tips
    - Keep the tone friendly and conversational
    - Make questions engaging and easy to understand
"""
def call_chatbot(state: ChatbotState):
    # Ensure static system message is present only once at the start
    msgs = state.get("messages", [])
    if not msgs or not (isinstance(msgs[0], SystemMessage) and "NestWise" in msgs[0].content):
        # Prepend the static system prompt (set earlier as system_prompt_chatbot)
        state["messages"] = [system_prompt_chatbot] + msgs
    # Load & log shadow profile
    shadow_profile = state.get("shadow_profile", {}) or {}
    #print("Shadow profile from Chat Bot", shadow_profile)
    state["shadow_profile"] = shadow_profile

    # Remove previous dynamic profile messages (avoid duplicate/conflicting snapshots)
    cleaned = []
    for m in state["messages"]:
        if isinstance(m, HumanMessage) and "Below is the user's current profile status." in (m.content or ""):
            continue
        cleaned.append(m)
    state["messages"] = cleaned

    # Build missing_fields robustly
    missing_fields = []
    for field, info in shadow_profile.items():
        if "status" not in info:
            info["status"] = "completed" if info.get("collected") else "missing"
        # Support both dict shape and direct boolean
        collected_val = None
        importance = 0
        if isinstance(info, dict):
            collected_val = info.get("collected")
            importance = info.get("importance", 0)
        else:
            # if info is a bare boolean or something else
            collected_val = info
            importance = 0
        if not normalize_collected(collected_val):
            missing_fields.append((field, importance))

    # Sort by importance desc
    missing_fields = sorted(
      [
          (field, info["importance"])
          for field, info in shadow_profile.items()
          if info.get("status", "missing") == "missing"
      ],
      key=lambda x: x[1],
      reverse=True
    )

    missing_fields_text = "\n".join([f"- {f} (importance: {imp})" for f, imp in missing_fields]) or "None"

    # Add a single, clean HumanMessage that contains the current profile snapshot
    profile_prompt = f"""
    Below is the user's current profile status.
    Each field has a 'collected' boolean and an 'importance' score (1.0 = most important):

    {shadow_profile}

    Missing fields sorted by importance:
    {missing_fields_text}

    Your job:
    1. Identify which field is most important and still missing.
    2. Ask the user about that specific field.
    3. If all fields are collected, respond with: "All necessary info collected. Proceeding to generate your plan."

    Return only the next chatbot message — no explanations, no JSON.
    """

    state["messages"].append(HumanMessage(content=profile_prompt))

    temp_old_prompt = None

    if state.get("chatbot_role", "") == "ask_for_updates":
      temp_old_prompt = state["messages"][0]
      state["messages"][0] = ""
      state["messages"].append(system_prompt_chatbot_ask_for_updates)

    # Debug print (optional)
    #print("missing_fields:", missing_fields)

    # Invoke model
    response = model_chatbot.invoke(state["messages"])

    # remove system prompt
    if state.get("chatbot_role", "default") == "ask_for_updates":
        state["chatbot_role"] = "default"
        state["messages"][0] = temp_old_prompt
        state["messages"] = state["messages"][:-1]

    # Get text
    reply_text = getattr(response, "content", None) or str(response)
    reply_text_stripped = reply_text.strip().lower()

    # Defensive override: if model says everything's collected but it's not, ask for top missing field
    if missing_fields and reply_text_stripped.startswith("all necessary info collected"):
        top_field = missing_fields[0][0].replace("_", " ")
        override_text = f"Could you please provide your {top_field}?"
        print("Model incorrectly said all collected — overriding to ask for:", top_field)
        override_message = AIMessage(content=override_text)
        state["messages"].append(override_message)
        return state

    # Otherwise append the model response and return
    state["messages"].append(response)
    return state

### Helper Function
def is_valid_matcher_response(response_text):
    """Return True if response is valid (JSON or 'None'), False otherwise."""
    if not response_text:
        return False

    response_text = response_text.strip()

    # Case 1: If it's exactly 'None'
    if response_text == "None":
        return True

    # Case 2: Check if it's valid JSON and matches format
    try:
        data = json.loads(response_text)
        if not isinstance(data, dict):
            return False

        for field, value in data.items():
            if not isinstance(value, dict):
                return False
            if "collected" not in value or "importance" not in value:
                return False
            if not isinstance(value["collected"], bool):
                return False
            if not isinstance(value["importance"], int):
                return False
        return True
    except json.JSONDecodeError:
        return False

def normalize_if_uncertain(user_answer, llm):
    # Step 1: detect uncertainty
    uncertainty_prompt = f"""
    You are classifying whether the user is refusing to answer or genuinely does not know.
    DO NOT mark a response as uncertain just because it uses relative or natural language
    (e.g., "after I retire", "in a few years", "when I'm older").

    Mark as "yes" ONLY when the user expresses:
    - refusal (e.g., "I'd rather not say", "skip this")
    - not knowing (e.g., "I don't know", "not sure", "I can't remember")
    - avoidance (e.g., "let's move on")

    Otherwise, even vague or approximate answers should be marked as "no".

    Respond ONLY with:
    "yes" or "no"

    User answer: "{user_answer}"
    """

    response = llm.invoke([{"role": "user", "content": uncertainty_prompt}])
    is_uncertain = response.content.strip().lower()

    # Step 2: normalize ONLY if uncertain
    if is_uncertain == "yes":
        return "unknown"

    return user_answer  # keep original

    # To call extractor
def call_extractor(state: ExtractorState):
    if state["extractor_role"] == "check_for_negatives":
      extractor_special_rules = extractor_special_role_update
    elif state["extractor_role"] == "default":
      extractor_special_rules = extractor_special_role_normal
    shadow_system_prompt = f"""
    Below is a dictionary representing the user's information. Each key corresponds
    to a data field, and each value indicates whether the information has already
    been collected:

    {state.get("shadow_profile", {})}

    Your task is to:
    1. Examine the conversation history that follows.
    2. For every field, check if the user has provided information that can fill that field.
    3. If the user has supplied the missing information, extract it accurately.
    4. If the user has supplies information of a field that is already completed, update the old value with the newly provided value.

    {extractor_special_rules}

    JSON Response rules:
    - Respond ONLY with a JSON object containing ONLY the fields you can now populate.
    - For updated fields, include the new value in the JSON.
    - If no new information is found, return: {{}}.
    - Do not include any explanation or text outside the JSON.
    """
    state["messages"] = [system_prompt_extract] + [SystemMessage(content=shadow_system_prompt)] + state["messages"]
    print([SystemMessage(content=shadow_system_prompt)])
    #print(f"\nEXTRACTOR: {state['messages']}")
    response = model_extractor.invoke(state["messages"])
    print(f"Extractor response: {response.content}")
    response_dict = json.loads(response.content)
    shadow_profile = state.get("shadow_profile", {})
    real_profile = state.get("real_profile", {})
    updated_some_fields = False

    if state["extractor_role"] == "check_for_negatives":
      print(response_dict.get("continue_asking", True))
      print("\n" + str(response_dict))
      if response_dict.get("continue_asking", True) == False:
        print("\ncontinue asking is FALSE\n")
        state["extractor_role"] = "default"
        print(state["extractor_role"])
        return state

    if not response_dict:
        return

        # Ensure all fields have a status
    for field, info in shadow_profile.items():
        if "status" not in info:
            info["status"] = "completed" if info.get("collected") else "missing"

    common_keys = response_dict.keys() & shadow_profile.keys()

    for key, raw_value in response_dict.items():
        if key not in shadow_profile:
            continue  # ignore unexpected fields

        normalized_value = normalize_if_uncertain(raw_value, model_extractor)

        # Case 1: user skipped/refused
        if normalized_value == "unknown":
            shadow_profile[key]["status"] = "skipped"
            shadow_profile[key]["collected"] = True

            real_profile[key] = "unknown"
            continue

        # Case 2: user gave REAL value (even if previously skipped)
        shadow_profile[key]["status"] = "completed"
        shadow_profile[key]["collected"] = True

        # Update real_profile
        real_profile[key] = normalized_value

        # Mark collected ONLY if we actually have a value or 'unknown'
        if isinstance(shadow_profile[key], dict):
            shadow_profile[key]["collected"] = True if normalized_value else False

    if "goal" in response_dict:
        # get last human message
        real_profile["goal"] = state["messages"][-1].content
        print("GOAL: " + str(real_profile["goal"]))

        # Generate title for conversation
        title_prompt = [
            {"role": "system", "content": "You generate short, clear titles for retirement planning conversations."},
            {"role": "user", "content": f"Create a concise, 3-8 word title summarizing this retirement goal: '{real_profile['goal']}'."}
        ]
        title_response = model_extractor.invoke(title_prompt)
        conversation_title = title_response.content.strip()
        state["conversation_title"] = conversation_title
        #print(f"\n\nConversation title: {state["conversation_title"]}\n\n")

    # Check if there are any differences between
    # the state's real profile and the new real profile
    if real_profile != state.get("real_profile", {}):
        updated_some_fields = True

    state["real_profile"] = real_profile
    boolValue = all(
        isinstance(info, dict) and info.get("collected", False)
        for info in shadow_profile.values()
    )
    state["all_fields_filled"] = boolValue
    state["real_profile"] = real_profile
    state["shadow_profile"] = shadow_profile
    state["updated_some_fields"] = updated_some_fields
    #print("New shadow_profile = {")
    for field, info in shadow_profile.items():
        collected = info["collected"]
        importance = info["importance"]
       # print(f" - {field}: collected={collected}, importance={importance}")

    print(real_profile)

    return state

## Call Matcher
def call_matcher(state: MatcherState):
    real_profile = state.get("real_profile", {})
    shadow_profile = state.get("shadow_profile", {})

    # Read the user goal from state
    user_goal = real_profile.get("goal", "")
    #print(f"\n\nUSER GOAL: {user_goal}")

    chain = system_prompt_matcher | model_matcher
    raw = chain.invoke({"user_goal": user_goal}).content.strip()
    #print(f"\n\nCATEGORY: {category}")


    # --------------------------
    # STEP 1: Parse JSON output
    # --------------------------
    # Remove all code fences
    raw = raw.replace("```json", "").replace("```", "").strip()
    try:
        result = json.loads(raw)
        primary = result.get("primary", "default").lower()
        secondary = result.get("secondary", None)
        if isinstance(secondary, str):
            secondary = secondary.lower()
        scores = result.get("scores", {})

    except Exception as e:
        print(f"JSON parsing error: {e}")
        print("Falling back to default classification.")
        primary = "default"
        secondary = None
        scores = {}

    # Enforce sanity: unknown categories → default
    valid_categories = set(prompt_infos.keys())
    if primary not in valid_categories:
        primary = "default"
    if secondary not in valid_categories:
        secondary = None

    print(f"PRIMARY CATEGORY → {primary}")
    print(f"SECONDARY CATEGORY → {secondary}")
    print(f"CONFIDENCE SCORES → {scores}\n")

    # Store in state
    state["selected_template"] = primary
    state["secondary_template"] = secondary
    state["category_scores"] = scores

    # -----------------------------------------
    # STEP 2: Merge questions from templates
    # -----------------------------------------
    merged_questions = {}

    # Add primary template questions
    for field, info in prompt_infos[primary]["questions"].items():
        merged_questions[field] = {
            "collected": False,
            "importance": info["importance"]
        }

    # Add secondary template questions (if any)
    if secondary:
        for field, info in prompt_infos[secondary]["questions"].items():
            # Only merge critical fields
            if info["importance"] >= 4:
                if field not in merged_questions:
                    merged_questions[field] = {
                        "collected": False,
                        "importance": info["importance"]
                    }
                else:
                    merged_questions[field]["importance"] = max(
                        merged_questions[field]["importance"],
                        info["importance"]
                    )

    # -----------------------------------------
    # STEP 3: Store merged questions in shadow_profile
    # -----------------------------------------
    shadow_profile.update(merged_questions)
    state["shadow_profile"] = shadow_profile

    print("Merged shadow_profile = {")
    for field, info in shadow_profile.items():
        print(f"  {field}: collected={info['collected']}, importance={info['importance']}")
    print("}")

#   print("New shadow_profile = {")
#   for field, info in shadow_profile.items():
#     collected = info["collected"]
#     importance = info["importance"]
#     print(f"  {field}: collected={collected}, importance={importance}")
#   print("}")

    return state

def call_summarizer(state: SummarizerState):
  state["messages"] = [system_prompt_summarize]  + state["messages"]
  #print(f"SUMMARIZER: {state['messages']}")
  response = model_extractor.invoke(state["messages"])
  #print(f"Summarizer response: {response.content}")
  return {"summary": response.content}

## To call RAG Agent
def query_or_respond(state: PlannerState):
    rag_query = (
      "You are a Retrieval Assistant. Given the user's retirement profile below, prepare up to 3 targeted retrieval "
  "queries (each 1–2 sentences) that will return the most relevant PDF chunks for building a retirement plan. "
  "For each retrieval query include: (1) what fact/type of evidence you want (e.g., contribution limits, withdrawal "
  "rates, tax rules, life expectancy tables), (2) any date or jurisdiction constraints, and (3) why the snippet is needed. "
  f"User Profile:\n{real_profile}\n\n"


  )
    state["messages"] =  [SystemMessage(rag_query)] + state["messages"]
    model_planner_with_tools = model_planner.bind_tools([retrieve])
    response = model_planner_with_tools.invoke(state["messages"])
    #print(f"Planner response: {response.content}")
    return {"messages": [response]}

# To Call Planner to give final resposnse
def call_planner(state: PlannerState):
  real_profile = state.get("real_profile", {})
  shadow_profile = state.get("shadow_profile", {})
  # Merge shadow + real profile
  user_profile_to_use = {**shadow_profile, **real_profile}

  # Flatten the nested dicts (take 'collected' or 'value' if available)
  flattened_profile = {}
  for k, v in user_profile_to_use.items():
      if isinstance(v, dict):
          # Choose a value to include — often 'value' or 'collected'
          flattened_profile[k] = str(v.get("value", v.get("collected", "unknown")))
      else:
          flattened_profile[k] = str(v)
  recent_tool_messages = []
  for message in reversed(state["messages"]):
      if message.type == "tool":
          recent_tool_messages.append(message)
      else:
          break
  tool_messages = recent_tool_messages[::-1]

  docs_content = "\n\n".join(doc.content for doc in tool_messages)
  import json

  structured_json_schema = {
      "investment_strategy": {
          "type": "object",
          "properties": {
              "asset_allocation": {
                  "type": "object",
                  "properties": {
                      "stocks": {"type": "number"},
                      "bonds": {"type": "number"},
                      "cash": {"type": "number"},
                      "other": {"type": "number"}
                  },
                  "required": ["stocks", "bonds", "cash", "other"]
              },
              "justification": {"type": "string"}
          },
          "required": ["asset_allocation", "justification"]
      },
      "savings_plan": {
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                  "year": {"type": "integer"},
                  "annual_contribution": {"type": "number"},
                  "expected_growth": {"type": "number"},
                  "source": {"type": "array", "items": {"type": "string"}}
              },
              "required": ["year", "annual_contribution", "expected_growth"]
          }
      },
      "risk_assessment": {
          "type": "object",
          "properties": {
              "inflation": {"type": "string"},
              "market_volatility": {"type": "string"},
              "mitigation_strategy": {"type": "string"}
          },
          "required": ["inflation", "market_volatility", "mitigation_strategy"]
      },
      "milestones": {
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                  "age": {"type": "integer"},
                  "action": {"type": "string"},
                  "expected_outcome": {"type": "string"},
                  "source": {"type": "array", "items": {"type": "string"}}
              },
              "required": ["age", "action", "expected_outcome"]
          }
      },
      "citations": {
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                  "fact": {"type": "string"},
                  "source": {"type": "string"},
                  "page": {"type": "integer"}
              },
              "required": ["fact", "source", "page"]
          }
      },
      "required": [
          "investment_strategy",
          "savings_plan",
          "risk_assessment",
          "milestones",
          "citations"
      ]
  }
  system_message_content = f"""
  You are a Retirement Planning Assistant. Your task is to produce a comprehensive, structured retirement plan
  for a user with profile {real_profile}, comparable to a professional financial advisor. Use the provided user profile to build a customize plan.
  Use ONLY the retrieved context below. Each fact must cite the source (filename and page).
  If unknown, write "unknown". Follow this schema strictly in JSON:

  Today's Date: {date.today().isoformat()}

  Your output must use the current year when generating projections, retirement timelines, contribution limits, and all forward-looking estimates.


  {json.dumps(structured_json_schema)}

  Retrieved Context:
  {docs_content}


  Instructions:
  1. Fill all fields with actionable, evidence-based recommendations.
  2. Include citations for all numerical data or regulatory references.
  3. Provide step-by-step advice for retirement savings, investment allocation, and milestones.
  4. Output ONLY valid JSON. Do not include markdown, explanations, or extra text.
  """
  state["messages"] =  [SystemMessage(system_message_content)] + state["messages"]
  response = model_planner.invoke(state["messages"])
  return {"messages": [response]}

## to decide to call the planner agent.
def route_decision_extractor(state: MasterState) -> str:
  profile_filled = state.get("extractor").get("all_fields_filled")
  profile = state.get("shadow_profile")
  current_template = state.get("matcher").get("selected_template", None)
  is_plan_generated = state.get("is_plan_generated", "CODE FAILED IN route_decision_extractor")
  is_asking = state.get("extractor").get("extractor_role") == "check_for_negatives"
  totImportance = 0
  totFilledImportance = 0
  for field, info in profile.items():
    totImportance += info["importance"]
    totFilledImportance += info["importance"] if info["collected"] else 0
  currentCompleteness = totFilledImportance/totImportance

  if currentCompleteness == COMPLETENESSRATIO:
    if not current_template:
      print("\n\nShould Call Matcher\n")
      return "matcher"

    if is_plan_generated:
      print(state.get("extractor").get("extractor_role"))
      print(is_asking)
      if is_asking:
        print("\n\nShould Call Chatbot, but updating!")
        state["chatbot"]["chatbot_role"] = "ask_for_updates"
        return "chatbot"
      else:
        print("\n\nShould Call Planner, updating plan\n")
        state["chatbot"]["chatbot_role"] = "default"
        return "planner"
    else:
      print("\n\nShould Call Planner, first plan being generated\n")

      return "planner"
  else:
    print("\n\nShould Call Chatbot, no plan yet\n")
    return "chatbot"

def route_decision_summarize(state: MasterState) -> str:
  summarize_threshold = 20
  messages_count = len(state.get("chatbot").get("messages"))

  if messages_count >= summarize_threshold:
    return "summarizer"
  else:
    return "__end__"

## RAG Implementation

# ---- Load PDFs from Google Drive folder ----
pdf_folder = "./retirement_pdfs"
pdf_files = glob.glob(f"{pdf_folder}/*.pdf")

loaded_docs = []
for file_path in pdf_files:
    try:
        loader = PyPDFLoader(file_path)
        pages = loader.load()   # returns one Document per page
        print(f"Loaded {file_path} -> {len(pages)} pages")
        loaded_docs.extend(pages)
        print(f"Loaded {file_path} -> {len(pages)} pages")
    except Exception as e:
        print(f"Failed to load {file_path}: {e}")

# Split docs into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=150)
splits = splitter.split_documents(loaded_docs)

# Add to vector store
_ = vector_store.add_documents(documents=splits)
print("Added PDF documents to InMemoryVectorStore. Total chunks:", len(splits))

#Rewrite query to be more effective for retrieval
def rewrite_query(user_query: str, real_profile: dict) -> str:
    """
    Rewrite a user retirement question into a precise retrieval query.
    """

    profile_context = f"""
    User Profile Context:
    Age: {real_profile.get("age")}
    Retirement Age: {real_profile.get("retirement_age")}
    Salary: {real_profile.get("salary")}
    Savings: {real_profile.get("savings")}
    Location: {real_profile.get("location")}
    """

    messages = [
        QUERY_REWRITE_SYSTEM,
        HumanMessage(content=f"""
        Original User Question:
        {user_query}

        {profile_context}
        """)
    ]

    response = model_query_rewriter.invoke(messages)
    return response.content.strip()

# Define retriever tool
@tool(response_format="content_and_artifact")
def retrieve(query: str):
    """Retrieve information related to a query from the vector store."""
    optimized_query = rewrite_query(query, real_profile)

    print("Original Query:", query)
    print("Optimized Query:", optimized_query)
    retrieved_docs = vector_store.similarity_search(optimized_query, k=5)
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

# Matcher
matcher_graph = StateGraph(MatcherState)
matcher_graph.add_node("matcher", call_matcher)
matcher_graph.add_edge(START, "matcher")
matcher_subgraph = matcher_graph.compile()

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
  last_chatbot = chatbot_messages[-1] if chatbot_messages else AIMessage(content="No Chatbot Messages Found")

  # Combine for the extractor's current processing
  extractor_state["messages"] = [HumanMessage(content=last_chatbot.content)] + last_human

  extractor_state = extractor_subgraph.invoke(extractor_state)

  master_state["extractor"] = dict(extractor_state)
  #print(master_state["extractor"].keys())
  master_state["real_profile"] = extractor_state.get("real_profile", {})
  master_state["shadow_profile"] = extractor_state.get("shadow_profile", {})
  master_state["conversation_title"] = extractor_state.get("conversation_title")
  #print(master_state["conversation_title"])
  return master_state


def run_matcher(master_state: MasterState):
  matcher_data = master_state.get("matcher", {})
  shadow_profile = master_state.get("shadow_profile", {})
  real_profile = master_state.get("real_profile", {})
  matcher_data["shadow_profile"] = shadow_profile
  matcher_data["real_profile"] = real_profile
  matcher_state = MatcherState(**matcher_data)

  matcher_state["messages"] = []

  # Run the matcher subgraph
  matcher_state = matcher_subgraph.invoke(matcher_state)

  # Save updated matcher state back into master
  master_state["matcher"] = dict(matcher_state)
  master_state["shadow_profile"] = matcher_state.get("shadow_profile", {})
  return master_state

def run_planner(master_state: MasterState):
    planner_data = master_state.get("planner", {})
    planner_state = PlannerState(**planner_data)
    planner_state=planner_subgraph.invoke(planner_state)
    master_state["planner"] = dict(planner_state)
    master_state["is_plan_generated"] = True
    master_state["extractor"]["extractor_role"] = "check_for_negatives"
    return master_state

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

workflow = StateGraph(MasterState)

workflow.add_node("chatbot", run_chatbot)
workflow.add_node("extractor", run_extractor)
workflow.add_node("matcher", run_matcher)
workflow.add_node("planner", run_planner)
workflow.add_node("summarizer", run_summarizer)

workflow.add_edge(START, "extractor")

workflow.add_conditional_edges(
    "extractor",
    route_decision_extractor,
    {
        "matcher": "matcher",
        "planner": "planner",
        "chatbot": "chatbot",
    },
)

workflow.add_edge("matcher", "chatbot")

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

#-------------------Fromatter to format the Planner's output--------------------
system_prompt_formatter = SystemMessage(content="""
You are a Formatter Assistant.
You receive raw JSON output from the Planner Agent.
Convert this raw JSON into a well-formatted, human-readable report.
Use the following guidelines:
1. Structure the report with clear sections and headings.
2. Use bullet points and numbered lists for clarity.
3. Highlight key recommendations and action items.
4. Mention that plan has been genrated using RAG (Retrieval Augmented Generation) techniques.
5. Ensure the report is easy to read and understand for a non-technical audience.
""")
def call_formatter(raw_json_str: str):
   

    model_formatter = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    # Defensive parsing: if the input is already a string, parse to dict
    try:
        parsed = json.loads(raw_json_str)
        formatted_json = json.dumps(parsed, indent=2)
    except json.JSONDecodeError:
        formatted_json = raw_json_str  # fallback

    messages = [
        system_prompt_formatter,
        HumanMessage(content=formatted_json)
    ]

    response = model_formatter.invoke(messages)
    return response.content

state = None
initialMessage = 'Hello! I am NestWiseAI. I am here to help you with Retirement!'
def start_session(session_id: str):
    """
    Initialize a new session and store its MasterState in the global sessions dict.
    """
    global state
    state = MasterState(
        messages=[],
        chatbot={"messages": [system_prompt_chatbot, assistant_message],
                 "chatbot_role": "default"},
        matcher={"need_no_more_fields": False},
        extractor={"all_fields_filled": False,
                   "conversation_title":"None",
                   "extractor_role": "default"},
        real_profile={},
        shadow_profile = {
        "goal": {"collected": False, "importance": 5, "status": "missing"},
        "age": {"collected": False, "importance": 5, "status": "missing"},
        "salary": {"collected": False, "importance": 5, "status": "missing"},
        "savings": {"collected": False, "importance": 5, "status": "missing"},
        "location": {"collected": False, "importance": 4, "status": "missing"}
        },
        conversation_title="initial",
        is_plan_generated = False
    )
    return session_id


# config = {"configurable": {"thread_id": "3"}}
assistant_message = AIMessage(content="Hello there, I'm NestWise! How can I help you plan for your retirement?")
prev_assistant_message = None

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
        response_text= planner_message.content
        from_planner = True

        # Call the formatter agent
       # response_text = call_formatter(raw_json)
        

    else:
        response_text = assistant_message.content
        prev_assistant_message = assistant_message
        from_planner = False

    
    ## Pass to the frontend.
    conversation_title = state["conversation_title"]

    # Always include the latest real_profile
    profile_data = {
        field: state["real_profile"].get(field, False)
        for field in state["shadow_profile"]
    }
    #print(profile_data)

    return {
        "response": response_text,
        "real_profile": profile_data,
        "conversation_title": conversation_title,
        "from_planner": from_planner
    } 