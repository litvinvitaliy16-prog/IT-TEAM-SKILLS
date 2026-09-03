from typing import AsyncGenerator
from database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, Path, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from models import DevelopersModel, SkillsModel
from schemas import SkillsInputSchema

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

async def get_developer_by_id(
    db: AsyncSession = Depends(get_db),
    developer_id: int = Path(gt=0)
):
    result = await db.execute(
        select(DevelopersModel)
        .options(selectinload(DevelopersModel.skills))
        .where(DevelopersModel.id == developer_id)
        )
    dev = result.scalar_one_or_none()
    if dev is None:
        raise HTTPException(
            status_code=404,
            detail=f"Developer by ID:{developer_id} - not found"
        )
    return dev

async def get_skill_by_id(
    db: AsyncSession = Depends(get_db),
    skill_id: int = Path(gt=0)
):
    result = await db.execute(
        select(SkillsModel)
        .options(selectinload(SkillsModel.developers))
        .where(SkillsModel.id == skill_id)
    )
    skill = result.scalar_one_or_none()
    if skill is None:
        raise HTTPException(
            status_code=404,
            detail=f"Skill by ID: {skill_id} - not found"
        )
    return skill

async def is_exists_skills(
    data: SkillsInputSchema,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SkillsModel)
        .where(SkillsModel.skill_name == data.skill_name)
    )
    skill = result.scalar_one_or_none()
    if skill:
        raise HTTPException(
            status_code=409,
            detail=f"Skill with name {data.skill_name} already exists"
        )
    