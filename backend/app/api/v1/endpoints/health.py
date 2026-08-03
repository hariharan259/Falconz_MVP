from fastapi import APIRouter

router = APIRouter()

@router.get("/health", response_model=dict, status_code=200)
def health_check() -> dict:
    """
    Health check endpoint for Kubernetes / Docker Swarm readiness probes.
    """
    return {
        "status": "ok",
        "service": "FalconZ API Gateway"
    }
