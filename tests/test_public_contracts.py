import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PublicContractTests(unittest.TestCase):
    def test_api_contract_has_authority_and_execution_boundary(self):
        contract = json.loads((ROOT / "contracts" / "api" / "openapi.json").read_text(encoding="utf-8"))
        self.assertIn("/v1/authorities", contract["paths"])
        self.assertIn("/v1/reservations/{reservation_id}/execute-v2", contract["paths"])

    def test_mcp_contract_separates_operator_mutations(self):
        contract = json.loads((ROOT / "contracts" / "mcp" / "tools.json").read_text(encoding="utf-8"))
        self.assertIn("tokey_request_spend", contract["agent_permitted_loop"])
        self.assertIn("tokey_approve_spend", contract["operator_mutations"])

    def test_proof_states_test_mode_and_no_real_money(self):
        proof = (ROOT / "docs" / "RAZORPAY_PROOF.md").read_text(encoding="utf-8")
        self.assertIn("Test Mode", proof)
        self.assertIn("No real money moved", proof)

    def test_no_environment_file_is_present(self):
        self.assertFalse(any(path.name.startswith(".env") and path.name != ".env.example" for path in ROOT.rglob(".env*")))


if __name__ == "__main__":
    unittest.main()
