from rest_framework.throttling import UserRateThrottle


class AuthRateThrottle(UserRateThrottle):
    scope = "auth"


class AIRateThrottle(UserRateThrottle):
    scope = "ai"