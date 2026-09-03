from pydantic import Field, ConfigDict, BaseModel
from enum import Enum

class CategoryEnum(str, Enum):
    junior = "Junior"
    middle = "Middle"
    senior = "Senior"
    lead = "Lead"
    architect = "Architect"

class SkillsOutShortSchema(BaseModel):
    id: int
    skill_name: str
    model_config = ConfigDict(from_attributes=True)


class DevelopersInputSchema(BaseModel):
    dev_name: str = Field(max_length=100)
    grade: CategoryEnum

class DevelopersOutSchema(BaseModel):
    id: int
    dev_name: str
    grade: str
    skills: list[SkillsOutShortSchema] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

class DevelopersOutShortSchema(BaseModel):
    id: int
    dev_name: str
    grade: str
    model_config = ConfigDict(from_attributes=True)

class SkillsInputSchema(BaseModel):
    skill_name: str = Field(max_length=100, examples=["FastAPI"])

class SkillsOutSchema(BaseModel):
    id: int
    skill_name: str
    developers: list[DevelopersOutShortSchema] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)
