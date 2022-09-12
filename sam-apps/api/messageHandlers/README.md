# Message Handlers
The Message Handler lambdas are those that are invoked in an event-driven manner,
in this case via an SQS Message.

## Document Transfer
The Document Transfer (aka `sqsHandler`) handler is invoked via a Command message observed on the 
Document Transfer SQS Queue. This lambda handles the transfer of Student Documents
to the CRM. Because it operates asycnshronously, we do not require that the Student
wait while all documents are transferred. It alos supports a retry mechanism by
replaying the message.