/* More simplified recreations for the Lead desk and Market pages. All names and figures are sample data. */

export function ListPanel() {
  const rows = [
    ['Harbor Cold Storage', 'Gulf Coast Power', 'Mar 2027'],
    ['Coastal Packaging', 'Lone Prairie Energy', 'Jun 2027'],
    ['Bayfront Foods', 'Gulf Coast Power', 'Aug 2027'],
    ['Nueces Machine Works', 'Mesa Retail Power', 'Nov 2027'],
    ['Port Aransas Ice', 'Lone Prairie Energy', 'Jan 2028'],
  ];
  return (
    <div className="pn pn-list">
      <div className="pn-list-head">
        <p>Renewals, coastal bend</p>
        <span>5 accounts</span>
      </div>
      <table>
        <thead><tr><th>Account</th><th>Current supplier</th><th>Contract ends</th></tr></thead>
        <tbody>
          {rows.map(([name, supplier, end]) => (
            <tr key={name}><td>{name}</td><td>{supplier}</td><td>{end}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AssignmentsPanel() {
  const rows = [
    ['Harbor Cold Storage', 'Survey', 'Ready for booking', 'high'],
    ['Bayfront Foods', 'Booking', 'Meeting Thursday', 'mid'],
    ['Coastal Packaging', 'Closing', 'Contract out for signature', 'mid'],
    ['Nueces Machine Works', 'Survey', 'Waiting on bill', 'low'],
  ];
  return (
    <div className="pn pn-assign">
      <p className="pn-assign-title">Assignments</p>
      <ul>
        {rows.map(([name, stage, note, level]) => (
          <li key={name}>
            <i data-level={level} />
            <div>
              <p>{name}</p>
              <span>{note}</span>
            </div>
            <em>{stage}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmailPanel() {
  return (
    <div className="pn pn-mail">
      <ul>
        <li data-open="true"><p>Dana Whitfield</p><span>Re: March bill and renewal options</span></li>
        <li><p>Ray Okafor</p><span>Updated meter list attached</span></li>
        <li><p>Lone Prairie Energy</p><span>Pricing desk: indicative rates</span></li>
      </ul>
      <div className="pn-mail-read">
        <p className="pn-mail-subject">Re: March bill and renewal options</p>
        <p>Thanks for the breakdown. Can you send the 24 and 36 month comparison before Thursday?</p>
        <div className="pn-mail-context">
          <span>Harbor Cold Storage</span>
          <span>Remind me if there is no reply by Friday</span>
        </div>
      </div>
    </div>
  );
}

export function MarketPanel() {
  const zones = [
    ['Houston', '31.42', [4, 6, 5, 8, 12, 9, 7]],
    ['North', '29.87', [5, 5, 6, 7, 10, 8, 6]],
    ['South', '33.10', [4, 7, 6, 9, 13, 11, 8]],
    ['West', '27.65', [6, 4, 5, 6, 9, 7, 5]],
  ] as const;
  return (
    <div className="pn pn-market">
      <div className="pn-market-head">
        <p>Market snapshot</p>
        <span>Sample figures</span>
      </div>
      <ul className="pn-zones">
        {zones.map(([zone, price, points]) => (
          <li key={zone}>
            <p>{zone} load zone</p>
            <svg viewBox="0 0 60 16" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={points.map((value, index) => `${index * 10},${16 - value}`).join(' ')} />
            </svg>
            <b>${price}<small> /MWh</small></b>
          </li>
        ))}
      </ul>
      <dl className="pn-market-stats">
        <div><dt>ERCOT demand</dt><dd>58.2 GW</dd></div>
        <div><dt>Henry Hub natural gas</dt><dd>$3.14</dd></div>
        <div><dt>U.S. working gas storage</dt><dd>3,412 Bcf</dd></div>
      </dl>
    </div>
  );
}

export function RadarPanel() {
  const rows = [
    ['Harbor Cold Storage', 'Gulf Coast Power', 4, 'high'],
    ['Coastal Packaging', 'Lone Prairie Energy', 7, 'high'],
    ['Bayfront Foods', 'Gulf Coast Power', 9, 'mid'],
    ['Nueces Machine Works', 'Mesa Retail Power', 12, 'mid'],
    ['Port Aransas Ice', 'Lone Prairie Energy', 14, 'low'],
  ] as const;
  return (
    <div className="pn pn-radar">
      <div className="pn-market-head">
        <p>Contract expiration radar</p>
        <span>Next 18 months</span>
      </div>
      <ul>
        {rows.map(([name, supplier, months, level]) => (
          <li key={name}>
            <div>
              <p>{name}</p>
              <span>{supplier}</span>
            </div>
            <div className="pn-radar-bar"><i data-level={level} style={{ width: `${(months / 18) * 100}%` }} /></div>
            <em>{months} mo</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
