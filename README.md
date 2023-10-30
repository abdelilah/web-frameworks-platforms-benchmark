# Web frameworks/platforms benchmark

The goal of this project is to compare the performance of various web frameworks and in PHP and Javascript platforms (potentially others in the future). Also, the benchmarks are designed to run periodically and automatically, so that the results can be compared over time as frameworks frequently get updated.

The tests are designed to be as simple as possible, and are not intended to be representative of real world applications. The results are not intended to be used to make decisions about which framework to use.

Comparing web frameworks and against vanila code may not sound releval, or even comparing some frameworks against each other. However this is a good way to see how much overhead a framework adds to your application and how far apart options are in terms of performance.

If you'd like to add a framework, or add more tests please submit a pull request.

## Frameworks

### PHP

-   Base PHP
-   [Laravel](https://laravel.com/)
-   [Slim](https://www.slimframework.com/)

### Javascript

-   Base NodeJS
-   Base Bun
-   [Express](https://expressjs.com/)

## How to run

### Requirements

Docker is required to run tests as it ensures that the environment is as similar as possible for each framework. It also helps to avoid having to install and configure each framework locally.

### Run tests

In your terminal, run the following command:

```shell
git clone git@github.com:abdelilah/web-frameworks-platforms-benchmark.git
cd web-frameworks-platforms-benchmark
./benchmark.sh
```

once the tests are done, a `report.html` file will be generated in the `benchmark-results` directory.


## Tests

In most cases especially for small applications, the performance of a web framework is not the bottleneck. However, it is still interesting to see how they compare for common tasks.

Each framework/platform should expose some API endpoints for the tests to run against.

The following table shows the tests that are currently implemented:

| Method | API endpoint | Description                                         |
| ------ | ------------ | --------------------------------------------------- |
| GET    | `/`          | Used by test runner to check if web server is ready |
| GET    | `/db`        | Queries the database and returns a JSON array       |
| GET    | `/info`      | Returns infos about the web framework or platform   |
