const salesforce = require('/opt/nodejs/salesforce');
const common = require('/opt/nodejs/common');
const db = require('/opt/nodejs/middleware-db');

exports.lambda_handler = async function(event, context) {
  // console.info('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))

  let apikey = '8d79180x-378f-42ae-884e-f2d00ad44f54'

  let applicationConfig = await db.getApplicationConfigByApikey(apikey)

  console.debug("CONFIG: Application Config: " + applicationConfig)

  // let sfAccessToken = await salesforce.getSalesforceAccessToken(applicationConfig)

  // console.debug(sfAccessToken)

  let studentId = 'studentappstest+rnp1@rnp.io'

  console.debug(' **************** Loading Student Profile ****************')
  let studentProfile = await salesforce.getStudentProfile(applicationConfig, studentId)
  if (studentProfile != undefined) console.info("action=loadStudentProfile, success=true, profile=" + JSON.stringify(studentProfile))
  else console.error("action=loadStudentProfile, success=false")

  console.debug('**************** Loading Success Contacts ****************')
  let studentSuccessContacts = await salesforce.getStudentSuccessContacts(applicationConfig, studentId)
  if (studentSuccessContacts != undefined) console.info("action=getStudentSuccessContacts, success=true, contacts=" + JSON.stringify(studentSuccessContacts))
  else console.error("action=getStudentSuccessContacts, success=false")
  
  console.debug('**************** Loading Student Tasks ****************')
  let studentTasks = await salesforce.getStudentTasks(applicationConfig, studentId)
  if (studentTasks != undefined) console.info("action=getStudentTasks, success=true, tsaks=" + JSON.stringify(studentTasks))
  else console.error("action=getStudentTasks, success=false")
  
  console.debug('**************** Loading Course List ****************')
  let courseList = await salesforce.getStudentCourseList(applicationConfig, studentId)
  if (courseList != undefined) console.info("action=getCourseList, success=true, courseList=" + JSON.stringify(courseList))
  else console.error("action=getCourseList, success=false")
  
  console.debug('**************** Loading Student Academic Terms ****************')
  let academicTerms = await salesforce.getStudentAcademicTerms(applicationConfig, studentId)
  if (academicTerms != undefined) console.info("action=getAcademicTerms, success=true, terms=" + JSON.stringify(academicTerms))
  else console.error("action=getAcademicTerms, success=false")
  
}