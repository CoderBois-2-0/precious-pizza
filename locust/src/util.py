def create_stage(duration: int, users: int, spawn_rate: int):
    """
    Returns a stage.
    Duration is how long it will run compared to the run_time variable.
    Users are the peak user count.
    Spawn rate is users per second to spawn or remove
    """
    return {"duration": duration, "users": users, "spawn_rate": spawn_rate}
