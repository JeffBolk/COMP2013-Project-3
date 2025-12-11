export default function FilterForm({ handleFilterPrice }) {
  return (
    <div>
      <h2>FilterPrice</h2>
      <form>
        {/* radiobutton for Show All */}
        <input
          type="radio"
          name="filterPrice"
          id="all"
          value="all"
          onChange={handleFilterPrice}
        />
        <label htmlFor="all">Show All</label>
        <br />
        {/* radiobutton for < 1.00$ */}
        <input
          type="radio"
          name="filterPrice"
          id="1"
          value={1}
          onChange={handleFilterPrice}
        />
        <label htmlFor="1">{"< 1.00$"}</label>
        <br />
        {/* radiobutton for < 2.00$ */}
        <input
          type="radio"
          name="filterPrice"
          id="2"
          value={2}
          onChange={handleFilterPrice}
        />
        <label htmlFor="2">{"< 2.00$"}</label>
        <br />
        {/* radiobutton for < 4.00$ */}
        <input
          type="radio"
          name="filterPrice"
          id="4"
          value={4}
          onChange={handleFilterPrice}
        />
        <label htmlFor="4">{"< 4.00$"}</label>
        <br />
        {/* radiobutton for < 6.00$ */}
        <input
          type="radio"
          name="filterPrice"
          id="6"
          value={6}
          onChange={handleFilterPrice}
        />
        <label htmlFor="6">{"< 6.00$"}</label>
        <br />
        {/* radiobutton for < 9.00$ */}
        <input
          type="radio"
          name="filterPrice"
          id="9"
          value={9}
          onChange={handleFilterPrice}
        />
        <label htmlFor="9">{"< 9.00$"}</label>
        <br />
      </form>
    </div>
  );
}
