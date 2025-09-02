import Axios from '../utils/http.config';

export class AssessmentService {
  static submit(assessment) {
    try {
      // POST request to /api/assessment (http.config adds /api automatically)
      // This sends the assessment data to the Express server
      return Axios.post(`/assessments`, assessment).then((response) => response.data);
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static getList() {
    try {
      // GET request to /api/assessment/list (http.config adds /api automatically)
      return Axios.get(`/assessments`, {
        params: {
          // TODO: Add any query parameters here for filtering, pagination, etc.
          // For example:
          // page: 1,
          // limit: 50,
          // status: 'active'
        },
      })
        .then((response) => response.data);
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }
};
