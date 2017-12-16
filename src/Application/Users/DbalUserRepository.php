<?php

namespace WouterDeSchuyter\Application\Users;

use Doctrine\DBAL\Connection;
use WouterDeSchuyter\Domain\Users\User;
use WouterDeSchuyter\Domain\Users\UserId;
use WouterDeSchuyter\Domain\Users\UserRepository;

class DbalUserRepository implements UserRepository
{
    public const TABLE = 'user';

    /**
     * @var Connection
     */
    private $connection;

    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @param User $user
     */
    public function add(User $user)
    {
        $this->connection->insert(self::TABLE, [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'salt' => $user->getSalt(),
            'password' => $user->getPassword(),
        ]);
    }

    /**
     * @param UserId $id
     * @return null|User
     */
    public function find(UserId $id): ?User
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('id = ' . $query->createNamedParameter($id));
        $query->andWhere('deleted_at IS NULL');
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return User::fromArray($result);
    }

    /**
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        $query = $this->connection->createQueryBuilder();
        $query->select('*');
        $query->from(self::TABLE);
        $query->where('email = ' . $query->createNamedParameter($email));
        $query->andWhere('deleted_at IS NULL');
        $result = $query->execute()->fetch();

        if (empty($result)) {
            return null;
        }

        return User::fromArray($result);
    }
}
