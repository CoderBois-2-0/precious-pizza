from locust import LoadTestShape
from util import create_stage


class SoakShape(LoadTestShape):
    stages = [
        create_stage(1200, 500, 10),
    ]

    def tick(self):
        run_time = self.get_run_time()

        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
