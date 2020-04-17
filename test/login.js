let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let path = require('path');
global.__configurations = require(path.resolve(__dirname, '../../config.js'));
let User = require(path.resolve(__dirname,'../../auth/models')).User;
let UserVerify = require(path.resolve(__dirname,'../../auth/models')).UserVerify;
let Token = require(path.resolve(__dirname,'../../auth/models')).Token;
// var rand = Math.random().toString(36).substring(7);
let should = chai.should();
let host = "http://" + process.env.IP + ':' + process.env.PORT;
let userInfo = {
    // email: `dave@gmail${rand}.com`,
    email: `dave@gmail.com`,
    password: "pwd",
    firstname: "Dave",
    lastname: "A"
}

describe('User login', () => {
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

    before((done) => {
        chai.request(host)
            .post('/api/user')
            .send(userInfo)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('it should allow a user with valid login credentials to login ', (done) => {
        var loginInfo = {
            email: userInfo.email,
            password: userInfo.password
        }
        chai.request(host)
            .post('/api/login')
            .send(loginInfo)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('it should not allow a user with invalid email to login', (done) => {
        var loginInfo = {
            email: "test@gmail.com",
            password: userInfo.password
        }
        chai.request(host)
            .post('/api/login')
            .send(loginInfo)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('it should not allow a user with invalid password to login', (done) => {
        var loginInfo = {
            email: userInfo.email,
            password: "test"
        }
        chai.request(host)
            .post('/api/login')
            .send(loginInfo)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
})