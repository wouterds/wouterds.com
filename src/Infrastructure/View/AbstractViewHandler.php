<?php

namespace WouterDeSchuyter\Infrastructure\View;

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Router;
use WouterDeSchuyter\Infrastructure\ApplicationMonitor\ApplicationMonitor;
use WouterDeSchuyter\Infrastructure\Config\Config;

abstract class AbstractViewHandler implements View
{
    /**
     * @var Twig
     */
    protected $twig;

    /**
     * @var Config
     */
    protected $config;

    /**
     * @var Router
     */
    protected $router;

    /**
     * @var Request
     */
    private $request;

    /**
     * @var ApplicationMonitor
     */
    private $applicationMonitor;

    /**
     * @param Twig $twig
     * @param Config $config
     * @param Router $router
     * @param Request $request
     * @param ApplicationMonitor $applicationMonitor
     */
    public function __construct(Twig $twig, Config $config, Router $router, Request $request, ApplicationMonitor $applicationMonitor)
    {
        $this->twig = $twig;
        $this->config = $config;
        $this->router = $router;
        $this->request = $request;
        $this->applicationMonitor = $applicationMonitor;
    }

    /**
     * @param Response $response
     * @param array $data
     * @return Response
     */
    public function render(Response $response, array $data = []): Response
    {
        $data['app'] = [];
        $data['app']['config'] = $this->config;
        $data['app']['router'] = $this->router;
        $data['app']['request'] = $this->request;
        $data['app']['report'] = $this->applicationMonitor->getReport();

        $data['page'] = [];
        $data['page']['info'] = $this->pageInfo();

        return $this->twig->renderWithResponse($response, $this->getTemplate(), $data);
    }

    /**
     * @return array
     */
    private function pageInfo(): array
    {
        $templateName = $this->getTemplate();
        $templateName = str_replace('pages/', null, $templateName);
        $templateName = str_replace('.html.twig', null, $templateName);
        $templateParts = preg_split( "/(-|\/)/", $templateName );
        $templateParts = array_filter($templateParts);

        $pascalCaseName = array_map('ucfirst', $templateParts);
        $pascalCaseName = implode('', $pascalCaseName);

        $dashedCaseName = implode('-', $templateParts);
        $dashedCaseName = lcfirst($dashedCaseName);

        return [
            'pascalCase' => $pascalCaseName,
            'dashedCase' => $dashedCaseName,
        ];
    }
}
