import { Row, Table } from 'antd';
import Text from 'antd/lib/typography/Text';
import React from 'react';
import { FaCheck, ImCross } from 'react-icons/all';

const PersonalResultComponent = ({ contest }) => {
  const personalResult = React.useMemo(() => contest?.submissions?.personal, [contest]);

  const tableData = React.useMemo(() => {
    if (!personalResult?.actualAnswers)
      return [];

    return personalResult.expectedAnswers?.map((expAns, i) => {
      const yourAnswer = personalResult.actualAnswers?.[i]?.toUpperCase?.() ?? "";
      let verdict = { message: "", isCorrect: true };

      if (!yourAnswer) {
        verdict.message = "No answer";
        verdict.isCorrect = false;
      } else {
        if (yourAnswer === expAns.toUpperCase()) {
          verdict.message = "Correct";
          verdict.isCorrect = true;
        }
        else {
          verdict.message = "Incorrect";
          verdict.isCorrect = false;
        }
      }

      return {
        id: i,
        yourAnswer,
        correctAnswer: expAns.toUpperCase(),
        verdict,
      }
    })

  }, [personalResult])

  return (
    <div hidden={!personalResult}>
      <Text strong className='orange' style={{ fontSize: 50 }}>
        Your score: {personalResult?.score ?? 0}/{personalResult?.expectedAnswers?.length ?? 0}
      </Text>
      <br />
      <Text strong style={{ fontSize: 20 }}>
        Detail:
      </Text>
      <Table dataSource={tableData} pagination={false} columns={[
        {
          key: "id",
          title: "ID",
          dataIndex: "id",
        },
        {
          key: "yourAnswer",
          title: "Your answer",
          dataIndex: "yourAnswer",
        },
        {
          key: "correctAnswer",
          title: "Correct answer",
          dataIndex: "correctAnswer",
        },
        {
          key: "verdict",
          title: "Verdict",
          dataIndex: "verdict",
          render: (verdict => (
            <Row>
              {verdict.isCorrect ?
                <FaCheck color='green' />
                :
                <ImCross color='red' />
              }
              <Text className='ml-2 mt-n1' strong>
                {verdict.message}
              </Text>
            </Row>
          ))
        },
      ]} />
    </div>
  )
}

export default PersonalResultComponent