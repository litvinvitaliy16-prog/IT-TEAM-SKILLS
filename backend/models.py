from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Table, Column
from database import Base

association_table = Table(
    "dev_skills",
    Base.metadata,
    Column("developers_id", ForeignKey("developers.id", ondelete="CASCADE"), primary_key=True),
    Column("skills_id", ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
)

class DevelopersModel(Base):
    __tablename__ = "developers"
    id: Mapped[int] = mapped_column(primary_key=True)
    dev_name: Mapped[str]
    grade: Mapped[str]
    skills: Mapped[list["SkillsModel"]] = relationship(
        secondary=association_table,
        back_populates="developers"
    )

class SkillsModel(Base):
    __tablename__ = "skills"
    id: Mapped[int] = mapped_column(primary_key=True)
    skill_name: Mapped[str] = mapped_column(unique=True)
    developers: Mapped[list["DevelopersModel"]] = relationship(
        secondary=association_table,
        back_populates="skills"
    )
