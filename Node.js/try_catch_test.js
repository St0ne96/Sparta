function errorException(isThrow) {
    try {
      console.log('자원을 할당하였습니다.');
      if (isThrow) throw new Error();
    } catch (error) {
      console.log('에러가 발생했습니다.');
    } finally {
      console.log('자원을 제거하였습니다.');
    }
  }
  
  errorException(false);
  // 자원을 할당하였습니다.
  // 자원을 제거하였습니다.
  errorException(true);
  // 자원을 할당하였습니다.
  // 에러가 발생했습니다.
  // 자원을 제거하였습니다.