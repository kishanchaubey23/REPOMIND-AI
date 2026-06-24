import { App, Octokit } from "octokit";
import  express  from "express";
const app=express();

app.post("/",req,res)=>{

}

const octokit = new Octokit({ 
  auth: process.env.github_token
});

