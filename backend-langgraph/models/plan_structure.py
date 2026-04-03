# Pydantic models for structured planner output
from pydantic import BaseModel
from typing import List

class AssetAllocation(BaseModel):
    stocks: float
    bonds: float
    cash: float
    other: float

class InvestmentStrategy(BaseModel):
    asset_allocation: AssetAllocation
    justification: str

class SavingsPlanItem(BaseModel):
    year: int
    annual_contribution: float
    expected_growth: float
    source: List[str]

class RiskAssessment(BaseModel):
    inflation: str
    market_volatility: str
    mitigation_strategy: str

class Milestone(BaseModel):
    age: float
    action: str
    expected_outcome: str
    source: List[str]

class Citation(BaseModel):
    fact: str
    source: str
    page: int

class RetirementPlan(BaseModel):
    investment_strategy: InvestmentStrategy
    savings_plan: List[SavingsPlanItem]
    risk_assessment: RiskAssessment
    milestones: List[Milestone]
    citations: List[Citation]