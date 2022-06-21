import { load } from "cheerio"
import fetch from "node-fetch"

export type LessonStuData = {
    number: number,
    stuId: number,
    name: string,
    gender: string,
    classId: string,
    majorId: number,
    major: string,
    academy: string,
    grade: number,
    statusState: string,
    courseState: string,
    courseType: string
}

export async function fetchLessonStuList(lessonId: string): Promise<Array<LessonStuData>> {
    const data: Array<LessonStuData> = [];
    const $ = load(await fetch(`http://jwzx.cqupt.edu.cn/kebiao/kb_stuList.php?jxb=${lessonId}`).then(res => res.text()));
    $("#stuListTabs-current table tbody tr").each((i, e) => {
        const [
            number, stuId, name, gender, classId, majorId, major, academy, grade, statusState, courseState, courseType
        ] = $(e).find("td").toArray().map(td => $(td).text());
        data.push(
            {
                number: parseInt(number),
                stuId: parseInt(stuId), 
                name, gender, classId, 
                majorId: parseInt(majorId), 
                major, academy, 
                grade: parseInt(grade), 
                statusState, 
                courseState, 
                courseType
            }
        );
    });
    return data;
}