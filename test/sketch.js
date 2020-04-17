let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let should = chai.should();
let path = require('path');
global.__configurations = require(path.resolve(__dirname, '../../config.js'));
let Sketch = require(path.resolve(__dirname,'../../sketches/models')).Sketch;
let token ;

let host = "http://" + process.env.IP + ':' + process.env.PORT;
let sketch = {
    "title":"Pet Sketch",
    "description" : "sketch of pet"
}
let rand = Math.random().toString(36).substring(7);
let userInfo = {
    email: `dave@gmail${rand}.com`,
    password: "pwd",
    firstname: "Dave",
    lastname: "A"
}
let sketchId;
let updatedSketch = {
    "title" : "Animal sketch",
}
describe('CREATE Sketch', () => {
    before((done) => {
        Sketch.destroy({
            where: {},
            truncate: true
        }).then((err) => {
            done()
        })
    })
    before((done) => {
        chai.request(host)
        .post('/api/user')
        .send(userInfo)
        .end((err, res) => {
            sketch.createdBy = res.body.id;
            sketch.modifiedBy = res.body.id;
            done();
        });
    })
    before((done) => {
        var loginInfo = {
            email: userInfo.email,
            password: userInfo.password
        }
        chai.request(host)
        .post('/api/login')
        .send(loginInfo)
        .end((err, res) => {
            token = res.body.token
            res.should.have.status(200);
            done();
        });
    })
    it('it should not create a sketch without a title and return 400 ', (done) => {
        let sketchPayload = JSON.parse(JSON.stringify(sketch));
        delete sketchPayload.title;
        chai.request(host)
            .post('/api/sketch')
            .set('Authorization',`bearer ${token}`)
            .send(sketchPayload)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should create a sketch', (done) => {
        chai.request(host)
            .post('/api/sketch')
            .set('Authorization',`bearer ${token}`)
            .send(sketch)
            .end((err, res) => {
                sketchId = res.body.id;
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.id.should.be.a('number');
                done();
            });
    });
    it('it should not create a sketch with duplicate title for the particular user and return 409 ', (done) => {
        let sketchPayload = JSON.parse(JSON.stringify(sketch));
        chai.request(host)
            .post('/api/sketch')
            .set('Authorization',`bearer ${token}`)
            .send(sketchPayload)
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
});

describe('GET sketch', () => {

    it('it should not allow a user with invalid token to view the list of sketches', (done) => {
        var invalidToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQifQ.-xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM';
        chai.request(host)
            .get('/api/sketch')
            .set('Authorization',`bearer ${invalidToken}`)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('it should list all sketches for the user ', (done) => {
        chai.request(host)
            .get('/api/sketch')
            .set('Authorization',`bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf.above(0); 
                done();
            });
    });

    it('it should fetch the details of the specified sketch', (done) => {
        chai.request(host)
            .get(`/api/sketch/${sketchId}`)
            .set('Authorization',`bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                done();
            });
    });
});


describe('UPDATE sketch', () => {

    it('it should return 400 when an invalid sketchId is given', (done) => {
        chai.request(host)
            .put('/api/sketch/0')
            .set('Authorization',`bearer ${token}`)
            .send(updatedSketch)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    
    it('it should update the title of sketch', (done) => {
        chai.request(host)
            .put(`/api/sketch/${sketchId}`)
            .set('Authorization',`bearer ${token}`)
            .send(updatedSketch)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('it should not update when the user has a sketch with the same title', (done) => {
        chai.request(host)
            .put(`/api/sketch/${sketchId}`)
            .set('Authorization',`bearer ${token}`)
            .send(updatedSketch)
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });

    it('it should update the description and title of the sketch', (done) => {
        updatedSketch.title = "New animal"
        updatedSketch.description = "Sketch of animal"
        chai.request(host)
            .put(`/api/sketch/${sketchId}`)
            .set('Authorization',`bearer ${token}`)
            .send(updatedSketch)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
})

describe('DELETE sketch', () => {
    it('it should return 400 when an invalid sketchId is given', (done) => {
        chai.request(host)
            .delete('/api/sketch/0')
            .set('Authorization',`bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    
    it('it should delete the sketch', (done) => {
        chai.request(host)
            .delete(`/api/sketch/${sketchId}`)
            .set('Authorization',`bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
