from locust import HttpUser, constant, task
from dotenv import dotenv_values

env = dotenv_values()


class FrontendAnonUser(HttpUser):
    host = env.get("FRONTEND_URL")
    wait_time = constant(0.5)

    @task()
    def index_page(self):
        self.client.get("/")

    @task()
    def pizza_page(self):
        self.client.get("/pizzaPage")

    @task()
    def checkout_page(self):
        self.client.get("/checkoutPage")


class FrontendAuthUser(HttpUser):
    host = env.get("FRONTEND_URL")
    wait_time = constant(0.5)

    def on_start(self):
        host = env.get("API_URL")
        email = env.get("AUTH_EMAIL")
        password = env.get("AUTH_PASSWORD")

        self.client.post(
            f"{host}/auth/login", json={"email": email, "password": password})

    @task()
    def user_page(self):
        self.client.get("/userPage")
