import 'whatwg-fetch';
import {
  STARTED_FETCHING_GRADES,
  FINISHED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
} from '../constants/actionTypes/grades';

const startedFetchingGrades = () => ({ type: STARTED_FETCHING_GRADES });
const finishedFetchingGrades = () => ({ type: FINISHED_FETCHING_GRADES });
const errorFetchingGrades = () => ({ type: ERROR_FETCHING_GRADES });
const gotGrades = grades => ({ type: GOT_GRADES, grades });
const fetchGrades = courseId => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return fetch(`http://localhost:18000/api/grades/v1/gradebook/${courseId}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOiBbInJlYWQiLCAid3JpdGUiLCAicHJvZmlsZSIsICJlbWFpbCJdLCAiYWRtaW5pc3RyYXRvciI6IHRydWUsICJhdWQiOiAibG1zLWtleSIsICJmYW1pbHlfbmFtZSI6ICIiLCAiaXNzIjogImh0dHA6Ly9lZHguZGV2c3RhY2subG1zOjE4MDAwL29hdXRoMiIsICJmaWx0ZXJzIjogW10sICJwcmVmZXJyZWRfdXNlcm5hbWUiOiAic3RhZmYiLCAibmFtZSI6ICIiLCAidmVyc2lvbiI6ICIxLjEuMCIsICJnaXZlbl9uYW1lIjogIiIsICJleHAiOiAxNTQxNzExNTU3LCAiaWF0IjogMTU0MTcwNzk1NywgImlzX3Jlc3RyaWN0ZWQiOiBmYWxzZSwgImVtYWlsIjogInN0YWZmQGV4YW1wbGUuY29tIiwgInN1YiI6ICI5MDIzNGM1NmE5NGNiODJkNWRjZDgxYTIzYmRhNjAwNyJ9.hvaJvCDVUwB533m5YDegjifDTvV5-WQLDGSrN47xjTE'
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error();
      })
      .then((data) => {
        dispatch(gotGrades(data.results));
        dispatch(finishedFetchingGrades());
      })
      .catch(() => dispatch(errorFetchingGrades()));
  }
);

export {
  startedFetchingGrades,
  finishedFetchingGrades,
  errorFetchingGrades,
  gotGrades,
  fetchGrades,
};
