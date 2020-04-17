let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let should = chai.should();
let path = require('path');
global.__configurations = require(path.resolve(__dirname, '../../config.js'));
let User = require(path.resolve(__dirname,'../../auth/models')).User;
let UserVerify = require(path.resolve(__dirname,'../../auth/models')).UserVerify;
let Token = require(path.resolve(__dirname,'../../auth/models')).Token;
// let rand = Math.random().toString(36).substring(7);
let host = "http://" + process.env.IP + ':' + process.env.PORT;
let userInfo = {
    // email: `dave@gmail${rand}.com`,
    email: `dave@gmail.com`,
    password: "pwd",
    firstname: "Dave",
    lastname: "A"
}

describe('User Creation', () => {
    before((done) => {
        User.destroy({
            where: {},
            truncate: true
        }).then((err) => {
            done()
        })
    })

    before((done) => {
        Token.destroy({
            where: {},
            truncate: true
        }).then((err) => {
            done()
        })
    })

    before((done) => {
        UserVerify.destroy({
            where: {},
            truncate: true
        }).then((err) => {
            done()
        })
    })

    it('it should not create an user without email and return 400 ', (done) => {
        let userInfoPayload = JSON.parse(JSON.stringify(userInfo));
        delete userInfoPayload.email;
        chai.request(host)
            .post('/api/user')
            .send(userInfoPayload)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should not create an user without a paasword and return 400 ', (done) => {
        let userInfoPayload = JSON.parse(JSON.stringify(userInfo));
        delete userInfoPayload.password;
        chai.request(host)
            .post('/api/user')
            .send(userInfoPayload)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should not create an user without firstname and return 400 ', (done) => {
        let userInfoPayload = JSON.parse(JSON.stringify(userInfo));
        delete userInfoPayload.firstname;
        chai.request(host)
            .post('/api/user')
            .send(userInfoPayload)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should not create an user without lastname and return 400 ', (done) => {
        let userInfoPayload = JSON.parse(JSON.stringify(userInfo));
        delete userInfoPayload.lastname;
        chai.request(host)
            .post('/api/user')
            .send(userInfoPayload)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should not create an user with invalid email ', (done) => {
        let userInfoPayload = JSON.parse(JSON.stringify(userInfo));
        userInfoPayload.email = "abc";
        chai.request(host)
            .post('/api/user')
            .send(userInfoPayload)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should create a user ', (done) => {
        chai.request(host)
            .post('/api/user')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('it should not create a user when an already existing email and return 409', (done) => {
        chai.request(host)
            .post('/api/user')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
});