/// <reference types="Cypress" />
import moment from 'moment';
import 'moment-timezone';
// If you are on MacOS and have many popups about Chromium when these tests run, please see: https://stackoverflow.com/questions/54545193/puppeteer-chromium-on-mac-chronically-prompting-accept-incoming-network-connect
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}
const baseUrl = Cypress.env('baseUrl');
const loginUrlPath = baseUrl + "/welcome";
const conferenceUrlPath = baseUrl + "/conference/newconference";
const getRoomName = () =>
    Math.random()
        .toString(36)
        .slice(2);
const uuid = () => Cypress._.random(0, 1e6)
const statusValues = ['In_progress','Completed','Scheduled'];
const providers = ['Twilio Video','Twilio Telephone'];
const roles = ['Parent','Parent Representative','District Representative','Other','Interpreter'];
const caseRef = uuid();

 context('Startup', () => {
   before(() => { 
                  let userName = Cypress.env('loginAdminUserName');
                  let password = Cypress.env('loginAdminPassword');
                  cy.login(conferenceUrlPath, userName, password);
                  const nowTime = moment.tz('Asia/Jerusalem');
                  cy.log('Current Timezone', nowTime.format('HH:mm:ss'));
                  let caseName = `caseName-${caseRef}`, hearingDate = nowTime.format('yyyy-MM-DD'),
                  startTime = nowTime.format('HH:mm:ss'), endTime = nowTime.add(2,'hours').format('HH:mm:ss'),
                  provider = providers[0], status = statusValues[getRandomInt(0,statusValues.length - 1)],
                  hearingOfficer = `reporter-${caseRef}`,
                  reporterPerson = getRandomInt(48,90).toString();

                  cy.createNewConference(conferenceUrlPath,caseRef, caseName, hearingDate, 
                    startTime,endTime, provider, status,hearingOfficer, reporterPerson);
                });

      beforeEach(() => {  
                  cy.visit(`${baseUrl}/auth/logout`);
                   cy.visit(`${loginUrlPath}/login?UserIdentifier=&Language=en-us&CaseReference=&Password=`);
                });

          it('should fill login form and get error of "The username/password is incorrect."', () => {
            let userName = generatePassword(4);
            let userPass = generatePassword(8);
            let caseRef = generateNumber(3);
            cy.fillConferenceLoginPage(userName,userPass,caseRef);

            cy.url().should('include', `${loginUrlPath}/login/-8?UserIdentifier=${userName}&Password=${userPass}&CaseReference=${caseRef}&Language=en-us`);
            cy.get('p').contains('The username/password is incorrect.').should('be.visible');
          })

          it('should fill login form and get error of "The case number you entered is invalid. Please re-enter your case number."', () => {
            let userName = Cypress.env('loginHOUserName');
            let userPass = Cypress.env('loginHOPassword');
            let caseRef = generateNumber(3);
            cy.fillConferenceLoginPage(userName,userPass,caseRef);

            cy.url().should('include', `${loginUrlPath}/login/-1?UserIdentifier=${userName}&Password=${userPass}&CaseReference=${caseRef}&Language=en-us`);
            cy.get('p').contains('The case number you entered is invalid. Please re-enter your case number.').should('be.visible');
          })
      
      it('should fill login form and redirect to twilio video app', () => {
            let userName = Cypress.env('loginHOUserName');
            let userPass = Cypress.env('loginHOPassword');
            cy.fillConferenceLoginPage(userName,userPass,caseRef);
            cy.url().should('include', '.cloudfront.net/');
            cy.log("url" + cy.url());
      })
      after(() => { 
        
      });   
    }); 
function generateNumber(length)
{
  let numberSet = "123456789";
  return generateStringFromRandomString(numberSet,length);
}

function generatePassword(length)
{
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return generateStringFromRandomString(charset,length);
}
function generateStringFromRandomString(randomString, length) {
  let retVal = "";
  for (var i = 0, n = randomString.length; i < length; ++i) {
     retVal += randomString.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }


    // context('A video app user', () => {
 
//   describe('before entering a room', () => {

//     it('should see their audio level indicator moving in the media device panel', () => {
//       cy.visit('/');
//       cy.get('clipPath rect')
//           .invoke('attr', 'y')
//           .should('be', 21);
//       cy.get('clipPath rect')
//           .invoke('attr', 'y')
//           .should('be.lessThan', 21);
//     });
//   });

//   describe('when entering an empty room that one participant will join', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.joinRoom('Hearing Officer','partyName' ,ROOM_NAME);
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME });
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     it('****WORKING TEST****: should be inside the correct room', () => {

//       cy.on('uncaught:exception', (err, runnable) => {
//         //expect(err.message).to.include('something about the error')

//         // using mocha's async done callback to finish
//         // this test so we prove that an uncaught exception was thrown
//         done()

//         // return false to prevent the error from failing this test
//         console.log(err);
//         return false
//       })
//       cy.get('header').should('contain', ROOM_NAME);
//       cy.getParticipant('testuser@Hearing Officer').should('contain', 'testuser');
//     });

//     // it('should be able to see the other participant', () => {
//     //   cy.get('[data-cy-main-participant]').should('contain', 'test1');
//     //   cy.getParticipant('test1')
//     //     .should('contain', 'test1')
//     //     .shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });

//     // it('should be able to hear the other participant', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     // });

//     // it('should see the participants audio level indicator moving', () => {
//     //   cy.getParticipant('test1')
//     //     .get('clipPath rect')
//     //     .invoke('attr', 'y')
//     //     .should('be', 21);
//     //   cy.get('clipPath rect')
//     //     .invoke('attr', 'y')
//     //     .should('be.lessThan', 21);
//     // });

//     // it('should see other participants disconnect when they close their browser', () => {
//     //   cy.task('participantCloseBrowser', 'test1');
//     //   cy.getParticipant('test1').should('not.exist');
//     //   cy.get('[data-cy-main-participant]').should('contain', 'testuser');
//     // });
//   });

//   describe('when entering a room with one participant', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME });
//       cy.joinRoom('testuser', ROOM_NAME);
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     // it('should be able to see the other participant', () => {
//     //   cy.get('[data-cy-main-participant]').should('contain', 'test1');
//     //   cy.getParticipant('test1')
//     //       .should('contain', 'test1')
//     //       .shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });

//     // it('should be able to hear the other participant', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     // });
//   });

//   describe('when entering an empty room that three participants will join', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.joinRoom('testuser', ROOM_NAME);
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME, color: 'red' });
//       cy.task('addParticipant', { name: 'test2', roomName: ROOM_NAME, color: 'blue' });
//       cy.task('addParticipant', { name: 'test3', roomName: ROOM_NAME, color: 'green' });
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     // it('should be able to see the other participants', () => {
//     //   cy.getParticipant('test1')
//     //       .should('contain', 'test1')
//     //       .shouldBeColor('red');
//     //   cy.getParticipant('test2')
//     //       .should('contain', 'test2')
//     //       .shouldBeColor('blue');
//     //   cy.getParticipant('test3')
//     //       .should('contain', 'test3')
//     //       .shouldBeColor('green');
//     // });

//     // it('should be able to hear the other participants', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     //   cy.getParticipant('test2').shouldBeMakingSound();
//     //   cy.getParticipant('test3').shouldBeMakingSound();
//     // });
//   });

//   describe('when entering a room with three participants', () => {
//     const ROOM_NAME = getRoomName();

//     before(() => {
//       cy.task('addParticipant', { name: 'test1', roomName: ROOM_NAME, color: 'red' });
//       cy.task('addParticipant', { name: 'test2', roomName: ROOM_NAME, color: 'blue' });
//       cy.task('addParticipant', { name: 'test3', roomName: ROOM_NAME, color: 'green' });
//       cy.joinRoom('testuser', ROOM_NAME);
//     });

//     after(() => {
//       cy.leaveRoom();
//     });

//     // it('should be able to see the other participants', () => {
//     //   cy.getParticipant('test1')
//     //       .should('contain', 'test1')
//     //       .shouldBeColor('red');
//     //   cy.getParticipant('test2')
//     //       .should('contain', 'test2')
//     //       .shouldBeColor('blue');
//     //   cy.getParticipant('test3')
//     //       .should('contain', 'test3')
//     //       .shouldBeColor('green');
//     // });

//     // it('should be able to hear the other participants', () => {
//     //   cy.getParticipant('test1').shouldBeMakingSound();
//     //   cy.getParticipant('test2').shouldBeMakingSound();
//     //   cy.getParticipant('test3').shouldBeMakingSound();
//     // });

//     // it('should see participant "test1" when they are the dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test2');
//     //   cy.task('toggleParticipantAudio', 'test3');
//     //   cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test1').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });
//     //
//     // it('should see participant "test2" when they are the dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test1');
//     //   cy.task('toggleParticipantAudio', 'test2');
//     //   cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test2').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });
//     //
//     // it('should see participant "test3" when they are the dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test2');
//     //   cy.task('toggleParticipantAudio', 'test3');
//     //   cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });
//     //
//     // it('should see participant "test3" when there is no dominant speaker', () => {
//     //   cy.task('toggleParticipantAudio', 'test3');
//     //   cy.getParticipant('test1').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test2').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').find('[data-cy-audio-mute-icon]');
//     //   cy.getParticipant('test3').shouldBeSameVideoAs('[data-cy-main-participant]');
//     // });

//   });
// });
