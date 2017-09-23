<?php

namespace Wouterds\Application;

use League\Container\Container as LeagueContainer;
use League\Container\ReflectionContainer;

class Container extends LeagueContainer
{
    /**
     * @return Container
     */
    public static function load()
    {
        $container = new static();
        $container->delegate(new ReflectionContainer());

        return $container;
    }
}
