const prisma = require("../lib/prisma");

async function createRepository({
    githubUrl,
    name,
    userId,
    stars,
    forks,
    language
}:{
    githubUrl:string,
    name:string,
    userId:string,
    stars:number,
    forks:number,
    language:string}){
    return await prisma.repository.create({
        data: {
            githubUrl,
            name,
            userId,
            forks,
            language,
            stars,
            status:"PENDING",
        }
    })
}

async function getRepositoryById(id:string){
    return await prisma.repository.findUnique({
        where: {id}
    })
}

async function getRepositoryByUser(userId:string){
    return await prisma.repository.findMany({
        where: {userId}
    })
}

async function updateRepositoryStatus(id: string,
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"){
    return await prisma.repository.update({
        where: {id},
        data:{status}
    })
}

module.exports = {
    createRepository,
    getRepositoryById,
    getRepositoryByUser,
    updateRepositoryStatus, 
}