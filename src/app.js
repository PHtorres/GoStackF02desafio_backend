const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const projects = [];
const projectLikes = [];


function logRequests(request, response, next){
    const {method, url} = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.time(logLabel);
    next();
    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
    const {id} = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid project ID'});
    }

    return next();
}

app.use(logRequests);

app.use('/repositories/:id', validateProjectId);

app.get('/repositories', (request, response) => {
    const {title} = request.query;
    const result = title?projects.filter(p => p.title.includes(title)):projects;
    const resultWithLikes = result.map(p=>{
        return Object.assign(p, {likes: projectLikes.filter(l => l.projectId === p.id).length});
    });

    return response.json(resultWithLikes);
});

app.post('/repositories', (request, response) => {
    const { title, url, techs, likes } = request.body;
    const newId = uuid();
 
    const project = {
        id: newId,
        title,
        url,
        techs,
    };

    projects.push(project);

    return response.json(project);
});

app.put('/repositories/:id', (request, response) => {
    const {id} = request.params;
    const { title, url, techs } = request.body;
    const projectIndex = projects.findIndex(p => p.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error:'Id not found'});
    }

    const project = {
        id,
        title,
        url,
        techs,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/repositories/:id', (request, response) => {
    const {id} = request.params;
    const projectIndex = projects.findIndex(p => p.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error:'Id not found'});
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.post('/repositories/:id/like', validateProjectId, (request, response) => {
    const {id} = request.params;

    const like = {
        id:uuid(),
        projectId: id
    }

    projectLikes.push(like);

    return response.json(like);
});


module.exports = app;
