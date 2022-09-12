const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('testing student handler endpoints', function() {
    // this is a test to mimic the postman tests, to check that the endpoints are functional
    this.timeout(30000);
    const tests = [
        // ----------------------    VALID    -------------------------------
        {
            description: 'get academic terms',
            endpoint: `/students/0035e0000023tyuAAA/academicTerms?includeCourseSections=true`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 200
        },
        {
            description: 'get profile',
            endpoint: `/students/0035e0000023tyuAAA/profile`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 200
        },
        {
            description: 'get success contacts',
            endpoint: `/students/0035e0000023tyuAAA/successContacts`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 200
        },
        {
            description: 'get tasks',
            endpoint: `/students/0035e0000023tyuAAA/tasks`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 200
        },
        {
            description: 'get completed tasks',
            endpoint: `/students/0035e0000023tyuAAA/tasks?completed=true`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 200
        },
        {
            description: 'get overdue tasks',
            endpoint: `/students/0035e0000023tyuAAA/tasks?overdue=true`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 200
        },
        // ----------------------    INVALID    -------------------------------
        {
            description: 'invalid api key',
            endpoint: `/students/0035e0000023tyuAAA/tasks`,
            api_key: '',
            statusCode: 502,
        },
        {
            description: 'invalid student id: profile',
            endpoint: `/students/123/profile`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 502,
        },
        {
            description: 'invalid student id: tasks',
            endpoint: `/students/undefined/tasks`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 502,
        },
        {
            description: 'invalid student id: completed tasks',
            endpoint: `/students/undefined/tasks?completed=true`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 502,
        },
        {
            description: 'invalid student id: overdue tasks',
            endpoint: `/students/undefined/tasks?overdue=true`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 502,
        },
        {
            description: 'invalid student id: academic terms',
            endpoint: `/students/undefined/academicTerms?includeCourseSections=true`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 502,
        },
        {
            description: 'invalid student id: success contacts',
            endpoint: `/students/undefined/successContacts`,
            api_key: '8d79180x-378f-42ae-884e-f2d00ad44f54',
            statusCode: 502,
        }
    ]
    tests.forEach(test => {
        it(test.description, async function() {
            const result = await chai.request(`http://127.0.0.1:3000`)
                .get(test.endpoint)
                .set('X-Api-Key', test.api_key);
            expect(result.body).to.be.an('object');
            expect(result.statusCode).to.eq(test.statusCode)
            console.info(result.body)
        })
    })
})