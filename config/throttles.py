from rest_framework.throttling import ScopedRateThrottle


class AuthRateThrottle(ScopedRateThrottle):
    scope = "auth"


class AIRateThrottle(ScopedRateThrottle):
    scope = "ai"