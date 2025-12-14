from locust import LoadTestShape
from util import create_stage


class SpikeShape(LoadTestShape):
    stages = [
        create_stage(60, 100, 10),
        create_stage(100, 1500, 100),
        create_stage(160, 100, 100),
    ]

    def tick(self):
        run_time = self.get_run_time()

        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
