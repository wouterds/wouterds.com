<?php

namespace WouterDeSchuyter\Application;

use League\Container\Container as LeagueContainer;
use League\Container\ReflectionContainer;
use WouterDeSchuyter\Application\Http\ServiceProvider as HttpServiceProvider;
use WouterDeSchuyter\Application\Users\ServiceProvider as UsersServiceProvider;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ServiceProvider as ApplicationMonitorServiceProvider;
use WouterDeSchuyter\Infrastructure\Config\ServiceProvider as ConfigServiceProvider;
use WouterDeSchuyter\Infrastructure\Database\ServiceProvider as DatabaseServiceProvider;
use WouterDeSchuyter\Infrastructure\View\ServiceProvider as ViewServiceProvider;

class Container extends LeagueContainer
{
    /**
     * @return Container
     */
    public static function load()
    {
        $container = new static();
        $container->delegate(new ReflectionContainer());

        $container->addServiceProvider(HttpServiceProvider::class);
        $container->addServiceProvider(UsersServiceProvider::class);
        $container->addServiceProvider(ApplicationMonitorServiceProvider::class);
        $container->addServiceProvider(ConfigServiceProvider::class);
        $container->addServiceProvider(DatabaseServiceProvider::class);
        $container->addServiceProvider(ViewServiceProvider::class);

        return $container;
    }
}
