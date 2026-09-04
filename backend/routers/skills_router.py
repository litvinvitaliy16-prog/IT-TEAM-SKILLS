from fastapi import APIRouter, Depends, HTTPException, status, Response
from models import SkillsModel
from schemas import SkillsInputSchema, SkillsOutShortSchema
from dependencies import get_db, is_exists_skills, get_skill_by_id
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.post("/create", response_model=SkillsOutShortSchema)
async def add_skills(
    data: SkillsInputSchema,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(is_exists_skills)
):
    new_skill = SkillsModel(**data.model_dump())
    db.add(new_skill)
    await db.commit()
    await db.refresh(new_skill)
    return new_skill

@router.get("/all", response_model=list[SkillsOutShortSchema])
async def all_skills(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(SkillsModel))
    skills = result.scalars().all()
    return skills

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill: SkillsModel = Depends(get_skill_by_id),
    db: AsyncSession = Depends(get_db)
):
    await db.delete(skill)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)