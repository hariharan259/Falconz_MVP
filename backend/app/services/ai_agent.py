import asyncio
from typing import Tuple, List

class FalconAIAgent:
    """
    Mock RAG Pipeline Service.
    In a production environment, this would integrate with LangChain/LlamaIndex, 
    OpenAI/Anthropic, and a Vector DB like PGVector.
    """
    
    def __init__(self):
        self.mock_docs = [
            {"id": "doc_1", "title": "PX4 Battery Calibration Manual", "snippet": "To calculate remaining flight time, use the formula: Time = (Capacity_mAh * Voltage) / Power_Watts."},
            {"id": "doc_2", "title": "Telemetry Anomaly Rules", "snippet": "A voltage drop of >1.5V during hover indicates severe cell degradation."}
        ]

    async def retrieve_context(self, query: str) -> List[dict]:
        """Simulates a semantic vector search."""
        await asyncio.sleep(0.5) # Simulate DB latency
        return self.mock_docs

    async def generate_response(self, query: str, context: List[dict]) -> Tuple[str, List[dict]]:
        """
        Simulates an LLM synthesizing a response based on retrieved context.
        We return hardcoded examples to demonstrate the UI parsing capabilities (Markdown, Math, Citations).
        """
        await asyncio.sleep(1.0) # Simulate LLM latency

        if "battery" in query.lower() or "time" in query.lower() or "math" in query.lower():
            reply = (
                "Based on the **PX4 Battery Calibration Manual**, the current battery health indicates a severe voltage drop. \n\n"
                "### Engineering Calculation\n"
                "Using the telemetry data, we can calculate the remaining hover time:\n"
                "```python\n"
                "capacity_mah = 5000\n"
                "current_voltage = 14.8\n"
                "power_draw_watts = 350\n\n"
                "flight_time_hrs = (capacity_mah / 1000 * current_voltage) / power_draw_watts\n"
                "flight_time_mins = flight_time_hrs * 60\n"
                "# Result: ~12.6 minutes remaining\n"
                "```\n\n"
                "**Recommendation:** I strongly advise initiating an automated `Return To Launch (RTL)` immediately to prevent critical power failure."
            )
            citations = [{"title": "PX4 Battery Calibration Manual", "link": "#"}]
        else:
            reply = (
                "I am the FalconZ AI Assistant. I have analyzed the current mission parameters and telemetry stream. "
                "All systems are nominal. If you need me to calculate flight times or analyze a specific hardware anomaly, just ask!"
            )
            citations = []

        return reply, citations

ai_agent = FalconAIAgent()
