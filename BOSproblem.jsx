const FlexContainer = styled.div`
  display: grid;
  //TODO: 아래 부분이 적용되지 않음 => 해당 비율만큼 안나눠짐 => 임시방편으로 grid-template-columns: 300px 4fr; 해결!
  grid-template-columns: 1fr 4fr; /* Set the width ratio to 1:3 */
  grid-gap: 30px; /* Add 5px spacing between grid items */
`;

<a
  className='text-decoration-none'
  href={`https://near.org/near/widget/ProfilePage?accountId=${accountId}&tab=overview`}
></a>;

// TODO: text-decoration-none 이 작동하지 않음
