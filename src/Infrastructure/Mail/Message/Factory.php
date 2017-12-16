<?php

namespace WouterDeSchuyter\Infrastructure\Mail\Message;

class Factory
{
    /**
     * @var Participant
     */
    private $sender;

    /**
     * @var Participant
     */
    private $replyTo;

    /**
     * @var Participant[]
     */
    private $receivers;

    /**
     * @var string
     */
    private $subject;

    /**
     * @var string
     */
    private $body;

    /**
     * @return Factory
     */
    public static function startWithDefault()
    {
        $factory = new self();
        $factory->sender = new Participant(
            getenv('MAIL_MESSAGE_SENDER_NAME'),
            getenv('MAIL_MESSAGE_SENDER_EMAIL')
        );
        $factory->receivers = [
            new Participant(
                getenv('MAIL_MESSAGE_RECEIVER_NAME'),
                getenv('MAIL_MESSAGE_RECEIVER_EMAIL')
            ),
        ];

        return $factory;
    }

    /**
     * @param Participant $sender
     * @return Factory
     */
    public function withSender(Participant $sender)
    {
        $this->sender = $sender;

        return $this;
    }

    /**
     * @param Participant $replyTo
     * @return Factory
     */
    public function withReplyTo(Participant $replyTo)
    {
        $this->replyTo = $replyTo;

        return $this;
    }

    /**
     * @param Participant[] $receivers
     * @return Factory
     */
    public function withReceivers(array $receivers)
    {
        $this->receivers = $receivers;

        return $this;
    }

    /**
     * @param string $subject
     * @return Factory
     */
    public function withSubject(string $subject)
    {
        $this->subject = $subject;

        return $this;
    }

    /**
     * @param string $message
     * @return Factory
     */
    public function withBody(string $message)
    {
        $this->body = $message;

        return $this;
    }

    /**
     * @return Message
     */
    public function build()
    {
        return new Message(
            $this->sender,
            $this->replyTo,
            $this->receivers,
            $this->subject,
            $this->body
        );
    }
}
