const request = require('supertest');
const {isUuid} = require('uuidv4');
const app = require('../../src/app');

describe('REPOSITORY', ()=>{
    it('should be able to create a new repository', async ()=>{
        const response = await request(app).post('/repositories').send({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
        });

        expect(isUuid(response.body.id)).toBe(true);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toMatchObject({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
          });
    });

    it("should be able to list the repositories", async () => {
        const repository = await request(app)
          .post("/repositories")
          .send({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
          });
    
        const response = await request(app).get("/repositories");
    
        expect(response.body).toEqual(
          expect.arrayContaining([
            {
              id: repository.body.id,
              title: "GoBolão", 
              url: "http://github.com/phtorres/appgobolao", 
              techs: [".Net Core", "React Native"],
              likes: 0
            }
          ])
        );
      });


      it("should be able to update repository", async () => {
        const repository = await request(app)
          .post("/repositories")
          .send({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
          });
    
        const response = await request(app)
          .put(`/repositories/${repository.body.id}`)
          .send({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
          });
    
        expect(isUuid(response.body.id)).toBe(true);
    
        expect(response.body).toMatchObject({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
        });
      });

      it("should not be able to update a repository that does not exist", async () => {
        await request(app)
          .put(`/repositories/123`)
          .expect(400);
      });

      it("should not be able to update repository likes manually", async () => {
        const repository = await request(app)
          .post("/repositories")
          .send({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
          });
    
        const response = await request(app).post(`/repositories/${repository.body.id}/like`);
    
        expect(response.body).toMatchObject({
          id: response.body.id,
          projectId:repository.body.id
        });

        expect(isUuid(response.body.id)).toBe(true);
      });

      it("should be able to delete the repository", async () => {
        const response = await request(app)
          .post("/repositories")
          .send({
            title: "GoBolão", 
            url: "http://github.com/phtorres/appgobolao", 
            techs: [".Net Core", "React Native"]
          });
    
        await request(app)
          .delete(`/repositories/${response.body.id}`)
          .expect(204);
    
        const repositories = await request(app).get("/repositories");
    
        const repository = repositories.body.find(r => r.id === response.body.id);
    
        expect(repository).toBe(undefined);
      });
    
      it("should not be able to delete a repository that does not exist", async () => {
        await request(app)
          .delete(`/repositories/123`)
          .expect(400);
      });
});