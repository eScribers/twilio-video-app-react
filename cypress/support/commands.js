import detectSound from './detectSound';

Cypress.Commands.add('createNewConference', (caseRef,hearingDate,startTime,hearingOfficer) => {
  cy.get('#showAddHearingForm').click();
  cy.get('input[id="hearing"]').type(hearingDate).should('have.value', hearingDate);
  cy.get('input[id="starttime"]').type(startTime).should('have.value', startTime);
  cy.get('input[id="studentname"]').type("Test Student").should('have.value', "Test Student");
  cy.get('[id="district"]').select("1");
  cy.get('input[id="office"]').type("1").should('have.value', "1");
  cy.get('[id="hearingofficer"]').select(hearingOfficer);
  cy.get('input[id="casenumber"]').type(caseRef).should('have.value', caseRef);

  cy.get('input[id="hearingid"]').type("1").should('have.value', "1");
  cy.get('[name="hearingtype"]').select("9");
 
  cy.get('div[id="addHearing"]').find('form').submit();
  cy.get('p').contains('Hearing created OK!').should('be.visible');
});

// See https://escribers.atlassian.net/browse/CA-860

// Cypress.Commands.add('createNewConference', (conferenceUrl,caseRef,caseName,hearingDate,startTime,endTime,
//   provider,status,hearingOfficer,reporterPerson) => {
//   cy.get('input[id="case_reference"]').type(caseRef).should('have.value', caseRef);
//   cy.get('input[id="case_name"]').type(caseName).should('have.value', caseName);
//   cy.get('input[id="hearing_date"]').type(hearingDate).should('have.value', hearingDate);
//   cy.get('input[id="start_time"]').type(startTime).should('have.value', startTime);
//   cy.get('input[id="end_time"]').type(endTime).should('have.value', endTime);
//   cy.get('[id="provider_id"]').select(provider);
//   cy.get('[id="status_id"]').select(status);
//   cy.get('input[id="hearing_officer"]').type(hearingOfficer).should('have.value', hearingOfficer);
//   cy.get('[id="reporter_person_id"]').select(reporterPerson);
 
//   cy.get('div[id="newconference"]').find('form').submit();
//   cy.get('p').contains('Conference created OK.').should('be.visible');
//   cy.url().should('include', conferenceUrl);
        
// });

Cypress.Commands.add('deleteExistingConference', (caseReference) => {

  cy.get('input[name="name"]').type(userName).should('have.value', userName);
  cy.get('input[name="passPin"]').type(password).should('have.value', password);
  cy.get('input[name="legalCaseReference"]').type(caseNumber).should('have.value', caseNumber);
  cy.get('form').submit();

});

Cypress.Commands.add('joinRoom', (partyType,partyName, caseNumber) => {
  cy.visit('/');
  cy.get('[data-cy="select"]').click();
  cy.get('[data-cy="menu-item"]').eq(1).click();
  cy.get('#case-number').type(caseNumber);
  cy.get('#party-name').type(partyName);
  cy.get('[type="submit"]').click();
  cy.get('[data-cy-main-participant]');
});

Cypress.Commands.add('leaveRoom', () => {
  cy.wait(500);
  cy.get('body').click(); // Makes controls reappear
  cy.get('#endCall').click();
  cy.task('removeAllParticipants');
  cy.get('#menu-room');
});

Cypress.Commands.add('shouldBeColor', { prevSubject: 'element' }, (subject, color) => {
  cy.wrap(subject)
    .find('video')
    .then($video => {
      cy.readFile(`cypress/fixtures/${color}.png`, 'base64').should('be.sameVideoFile', $video);
    });
});

Cypress.Commands.add('shouldBeSameVideoAs', { prevSubject: 'element' }, (subject, participant) => {
  cy.wrap(subject)
    .find('video')
    .then($video =>
      cy
        .get(participant)
        .find('video')
        .should('be.sameVideoTrack', $video)
    );
});

Cypress.Commands.add('getParticipant', name => cy.get(`[data-cy-participant="${name}"]`));

function getParticipantAudioTrackName(name, window) {
  const participant = Array.from(window.twilioRoom.participants.values()).find(
    participant => participant.identity === name
  );
  const audioTrack = Array.from(participant.audioTracks.values())[0].track;
  return audioTrack.name;
}

Cypress.Commands.add('shouldBeMakingSound', { prevSubject: 'element' }, subject => {
  const resolveValue = $el =>
    detectSound($el[0]).then(value => {
      return cy.verifyUpcomingAssertions(
        value,
        {},
        {
          onRetry: () => resolveValue($el),
        }
      );
    });
    
  cy.window()
    .then(win => {
      const participantIdentity = subject.attr('data-cy-participant');
      const trackName = getParticipantAudioTrackName(participantIdentity, win);
      return win.document.querySelector(`[data-cy-audio-track-name="${trackName}"]`);
    })
    .then(resolveValue)
    .should('equal', true);
});
