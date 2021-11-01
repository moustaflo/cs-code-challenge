let server = require('../index');
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Test get route /', () => {
    it('should return all users', (done) => {
        chai.request(server)
        .get('/')
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            done();
        });
    })

    it('should return a 404', (done) => {
        chai.request(server)
        .get('/non-exitent-route')
        .end((err, response) => {
            response.should.have.status(404);
            done();
        });
    })
})

describe('Test get route /details/:id', () => {
    it('should return user details with the right id', (done) => {
        const id = 1;
        chai.request(server)
        .get('/details/' + id)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            done();
        });
    })

    it('should return a 404 if :id is not a number type', (done) => {
        const id = 'string';
        chai.request(server)
        .get('/details/' + id)
        .end((err, response) => {
            response.should.have.status(404);
            done();
        });
    })

    it('should return a 404 if :id is not an integer', (done) => {
        const id = 1.5;
        chai.request(server)
        .get('/details/' + id)
        .end((err, response) => {
            response.should.have.status(404);
            done();
        });
    })

    it('should return a 404 if :id is less than 0', (done) => {
        const id = -1;
        chai.request(server)
        .get('/details/' + id)
        .end((err, response) => {
            response.should.have.status(404);
            done();
        });
    })

    it('should return a 404 if :id is greater than 50', (done) => {
        const id = 51;
        chai.request(server)
        .get('/details/' + id)
        .end((err, response) => {
            response.should.have.status(404);
            done();
        });
    })
})