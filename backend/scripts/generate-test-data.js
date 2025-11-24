const { db, initDatabase, dbRun, dbQuery } = require('../db');

// 한국 이름 리스트
const firstNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '준서', '건우', 
                    '서연', '서윤', '지우', '서현', '민서', '하은', '예은', '윤서', '채원', '지원'];
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];

function getRandomName() {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${lastName}${firstName}`;
}

function getRandomStatus() {
  const statuses = ['출석', '결석', '지각', '조퇴'];
  const weights = [0.7, 0.1, 0.15, 0.05]; // 출석이 더 많이 나오도록
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return statuses[i];
    }
  }
  return statuses[0];
}

function getRandomDate(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const randomTime = Math.random() * timeDiff;
  const randomDate = new Date(start.getTime() + randomTime);
  return randomDate.toISOString().split('T')[0];
}

async function generateTestData() {
  try {
    console.log('데이터베이스 초기화 중...');
    await initDatabase();

    console.log('기존 데이터 삭제 중...');
    await dbRun('DELETE FROM attendance');
    await dbRun('DELETE FROM students');

    console.log('테스트 학생 데이터 생성 중...');
    const studentIds = {};

    // 각 교실당 20명씩 학생 생성
    for (let classroom = 1; classroom <= 5; classroom++) {
      studentIds[classroom] = [];
      for (let i = 0; i < 20; i++) {
        const name = getRandomName();
        const result = await dbRun(
          'INSERT INTO students (name, classroom) VALUES (?, ?)',
          [name, classroom]
        );
        studentIds[classroom].push(result.id);
        console.log(`  ${classroom}호실: ${name} 추가됨`);
      }
    }

    console.log('\n출결 기록 생성 중...');
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30); // 30일 전부터
    const startDateStr = startDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    let totalRecords = 0;
    for (let classroom = 1; classroom <= 5; classroom++) {
      for (const studentId of studentIds[classroom]) {
        // 각 학생당 평균 20-25일의 출결 기록 생성
        const recordCount = Math.floor(Math.random() * 6) + 20;
        const usedDates = new Set();

        for (let i = 0; i < recordCount; i++) {
          let date;
          do {
            date = getRandomDate(startDateStr, todayStr);
          } while (usedDates.has(date));
          usedDates.add(date);

          const status = getRandomStatus();
          await dbRun(
            'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
            [studentId, date, status]
          );
          totalRecords++;
        }
      }
      console.log(`  ${classroom}호실 출결 기록 생성 완료`);
    }

    console.log(`\n✅ 테스트 데이터 생성 완료!`);
    console.log(`   - 학생 수: ${5 * 20}명`);
    console.log(`   - 출결 기록: ${totalRecords}건`);

    // 통계 출력
    console.log('\n📊 생성된 데이터 통계:');
    for (let classroom = 1; classroom <= 5; classroom++) {
      const stats = await dbQuery(`
        SELECT 
          a.status,
          COUNT(*) as count
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.classroom = ?
        GROUP BY a.status
      `, [classroom]);

      console.log(`\n${classroom}호실:`);
      stats.forEach(stat => {
        console.log(`  ${stat.status}: ${stat.count}건`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

generateTestData();

