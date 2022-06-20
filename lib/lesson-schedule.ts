import { load } from "cheerio";
import fetch from "node-fetch";

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

/**
 * 拉取课表数据
 * @param stuId 学号
 * @param theWeek 指定周,默认为0,即全部周
 */
export async function fetchLessonSchedule(stuId: number, theWeek: number = 0): Promise<LessonScheduleData> {
    const data: LessonScheduleData = {
        stuId,
        lesson: []
    }
    const htmlText = await fetch(`http://jwzx.cqupt.edu.cn/kebiao/kb_stu.php?xh=${stuId}`).then(res => res.text());
    const $ = load(htmlText);
    const [_, ...theadTds] = $('#stuPanel thead tr td').toArray();
    theadTds.forEach(td => {
        data.lesson.push(
            {
                label: $(td).text(),
                data: []
            }
        )
    })
    const tbodys = $("#stuPanel table tbody");
    tbodys.each((_, tbody) => {
        const trs = $(tbody).find("tr");
        trs.each((_, tr) => {
            const [label, ...tds] = $(tr).find("td").toArray();
            tds.map(td => $(td).find(".kbTd")).forEach((kbTds, i) => {
                data.lesson[i].data.push(
                    {
                        label: $(label).text(),
                        data: []
                    }
                )
                if (kbTds.length === 0) {
                    return
                }
                kbTds.each((_, td) => {
                    const weekFlags = [...$(td).attr("zc")!]
                    if (theWeek != 0 && weekFlags[theWeek] === "0") {
                        return
                    }
                    const text = $(td).html()!!;
                    let [lessonId, lessonName, classroom, weeks, teacher_type_credit, stuListId] = text.split("<br>")
                        .map(s => {
                            return s.trim()
                                .replace(RegExp("\n", "g"), "")
                                .replace(RegExp("\t", "g"), "")
                                .replace("<font color=\"#FF0000\">", "")
                                .replace("</font>", "")
                                .replace("<span style=\"color:#0000FF\">", "")
                                .replace("</span>", "")
                        });
                    classroom = classroom.replace("地点：", "");
                    const [teacher, type, credit] = teacher_type_credit.split(" ");
                    stuListId = load(stuListId)("a").attr("href")!!.split("jxb=")[1];
                    const d = data.lesson[i].data
                    d[d.length - 1].data.push(
                        {
                            lessonId,
                            lessonName,
                            classroom,
                            weeks,
                            teacher,
                            type,
                            credit: parseInt(credit),
                            stuListId
                        }
                    )
                })
            });
        });
    })
    return data;
}