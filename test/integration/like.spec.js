const request = require("supertest");
const app = require('../../src/app');

describe("LIKES", () => {
    it("should be able to give a like to the repository", async () => {
        const repository = await request(app)
            .post("/repositories")
            .send({
                title: "GoBolão",
                url: "http://github.com/phtorres/appgobolao",
                techs: [".Net Core", "React Native"]
            });

        let response = await request(app).post(
            `/repositories/${repository.body.id}/like`
        );


        let repositories = await request(app).get('/repositories');

        let project = repositories.body.filter(p => p.id === repository.body.id)[0];

        expect(project.likes).toBe(1);

        response = await request(app).post(
            `/repositories/${repository.body.id}/like`
        );

        repositories = await request(app).get('/repositories');
        project = repositories.body.filter(p => p.id === repository.body.id)[0];

        expect(project.likes).toBe(2);
    });

    it("should not be able to like a repository that does not exist", async () => {
        await request(app)
            .post(`/repositories/123/like`)
            .expect(400);
    });
});
