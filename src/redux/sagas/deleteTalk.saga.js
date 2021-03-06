import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


//"soft deletes" talks from the DB
function* deleteTalk(action){
    
    let id = action.payload.id;
    yield axios.delete(`/api/delete/talk/${id}`);

    yield put({type: 'FETCH_ALL_TALKS'});
}

function* deletedSaga() {
    yield takeLatest('DELETE_TALK', deleteTalk);
  }
  
  export default deletedSaga;