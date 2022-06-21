# cqupt-stu-system-fetch

> 爬取教务在线学生信息
>
> 打成npm包，供直接调用

只在校园网环境下可用

## Build

> npm build
>
> npm publish

## Usage

~~~ts
import { fetchLessonSchedule, LessonScheduleData, fetchLessonStuList, LessonStuData } from 'cqupt-stu-system-fetch';

(async () => {
    // 拉取课表
    const data: LessonScheduleData = await fetchLessonSchedule(stuId, 0);
    console.log(data);
    // 拉取课程参加者名单
    const stuList: Array<LessonStuData> = await fetchLessonStuList(lessonId)
    console.log(stuList);
})()
~~~

返回值类型定义

~~~ts
export type LessonScheduleData = {
    stuId: number,
    lesson: Array<{
        label: string,
        data: Array<{
            label: string,
            data: Array<{
                lessonId: string,
                lessonName: string,
                classroom: string,
                weeks: string,
                teacher: string,
                type: string,
                credit: number,
                stuListId: string,
            }>
        }>
    }>
}

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
~~~

## Log

- 2022/6/20 完成了课表的爬取