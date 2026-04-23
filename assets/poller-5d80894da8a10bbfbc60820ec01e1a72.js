/**
 * 유효할 때 까지 handler를 동작시키는 Polling 메서드
 *
 * @param handler 실제 동작을 하는 handler
 * @param interval 재시도 요청 간격 시간 (밀리초, ms)
 * @param maxAttempts 최대 재시도 횟수
 * @param validate 유효성 검사
 */
const poller = ({ handler, interval, maxAttempts, validate }) => {
    let attempts = 0;

    const execute = async (resolve, reject) => {
        const result = await handler();
        attempts++;

        if (validate && validate(result)) {
            return resolve(result);
        } else if (maxAttempts && attempts === maxAttempts) {
            return reject(new Error(`최대 시도 횟수를 초과했습니다: ${maxAttempts}`));
        } else {
            setTimeout(execute, interval, resolve, reject);
        }
    };

    return new Promise(execute);
}
