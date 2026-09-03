/**
 * FastAPI Backend REST Client
 */
const API_BASE_URL = window.API_BASE_URL || 
  (window.location.hostname ? `${window.location.protocol}//${window.location.hostname}:8080` : 'http://localhost:8080');

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 204) {
        return null;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorDetail = (data && data.detail) || `HTTP error ${response.status}: ${response.statusText}`;
        throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
      }

      return data;
    } catch (error) {
      console.error(`[API ERROR] ${options.method || 'GET'} ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check & ping measurement
  async checkHealth() {
    const start = performance.now();
    try {
      // Try to fetch developers list as healthcheck
      const response = await fetch(`${this.baseUrl}/api/dev/all`, { method: 'GET' });
      const latency = Math.round(performance.now() - start);
      return { online: response.ok, latency };
    } catch (e) {
      return { online: false, latency: 0, error: e.message };
    }
  }

  // --- DEVELOPERS ---
  async getAllDevelopers() {
    return this.request('/api/dev/all', { method: 'GET' });
  }

  async getDeveloperById(devId) {
    return this.request(`/api/dev/developer_by_id/${devId}`, { method: 'GET' });
  }

  async createDeveloper(devData) {
    return this.request('/api/dev/create', {
      method: 'POST',
      body: JSON.stringify(devData),
    });
  }

  async deleteDeveloper(devId) {
    return this.request(`/api/dev/${devId}`, {
      method: 'DELETE',
    });
  }

  async linkSkillToDeveloper(devId, skillId) {
    return this.request(`/api/dev/join_skill/${devId}/${skillId}`, {
      method: 'POST',
    });
  }

  async unlinkSkillFromDeveloper(devId, skillId) {
    return this.request(`/api/dev/skill_join_delete/${devId}/${skillId}`, {
      method: 'DELETE',
    });
  }

  // --- SKILLS ---
  async getAllSkills() {
    return this.request('/api/skills/all', { method: 'GET' });
  }

  async createSkill(skillData) {
    return this.request('/api/skills/create', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async deleteSkill(skillId) {
    return this.request(`/api/skills/${skillId}`, {
      method: 'DELETE',
    });
  }
}

window.api = new ApiClient();

