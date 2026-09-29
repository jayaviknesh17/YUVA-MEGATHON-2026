def test_health_check_root_endpoint(client):
    """Test GET /health returns HTTP 200 with status ok."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app_name" in data
    assert "environment" in data


def test_health_check_v1_endpoint(client):
    """Test GET /api/v1/health returns HTTP 200 with status ok."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
