from fastapi import APIRouter, HTTPException, Depends, Response, status
from schemas import DevelopersInputSchema, DevelopersOutSchema, DevelopersOutShortSchema
from dependencies import get_db, get_developer_by_id, get_skill_by_id
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from models import DevelopersModel, SkillsModel, association_table
from sqlalchemy import select

router = APIRouter(prefix="/api/dev", tags=["Developers"])

@router.post("/create", response_model=DevelopersOutShortSchema)
async def create_dev(
    data: DevelopersInputSchema,
    db: AsyncSession = Depends(get_db)
):
    new_developer = DevelopersModel(**data.model_dump())
    db.add(new_developer)
    await db.commit()
    await db.refresh(new_developer)
    return new_developer

@router.get("/developer_by_id/{developer_id}", response_model=DevelopersOutSchema)
async def dev_by_id(
    dev: DevelopersModel = Depends(get_developer_by_id) 
):
    return dev

@router.post("/join_skill/{developer_id}/{skill_id}", response_model=DevelopersOutSchema)
async def join_skill_2_dev(
    skill: SkillsModel = Depends(get_skill_by_id),
    dev: DevelopersModel = Depends(get_developer_by_id),
    db: AsyncSession = Depends(get_db)
):
    if skill in dev.skills:
        raise HTTPException(
            status_code=409,
            detail=f"Skill {skill.skill_name} already exists to {dev.dev_name}, by ID: {dev.id}"
        )
    dev.skills.append(skill)
    await db.commit()
    return dev

@router.get("/all", response_model=list[DevelopersOutSchema])
async def all_dev(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(DevelopersModel)
        .options(selectinload(DevelopersModel.skills))
    )
    developers = result.scalars().all()
    return developers

@router.delete("/{developer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_developer(
    dev: DevelopersModel = Depends(get_developer_by_id),
    db: AsyncSession = Depends(get_db)
):
    await db.delete(dev)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/skill_join_delete/{developer_id}/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill_join(
    skill: SkillsModel = Depends(get_skill_by_id),
    dev: DevelopersModel = Depends(get_developer_by_id),
    db: AsyncSession = Depends(get_db)
):
    if skill not in dev.skills:
        raise HTTPException(
            status_code=404,
            detail=f"Link not found"
        )
    dev.skills.remove(skill)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)