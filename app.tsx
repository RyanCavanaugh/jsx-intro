interface RepoProps extends React.Props<any> {
	name: string;
	url: string;
	description: string;
}
class RepoDisplay extends React.Component<RepoProps, {}> {
	render() {
		return <div>
			<span style={{'fontWeight': 'bold'}}><a href={this.props.url}>{this.props.name}</a>: </span>
			<span>{this.props.description}</span>
		</div>;
	}
}

let settings = { url: 'https://api.github.com/users/microsoft/repos?sort=updated' };
$.ajax(settings).then((data) => {
	let content = <div>{data.map((entry, i) => <RepoDisplay key={i} {...entry} url={entry.html_url} />) }</div>;
	let target = document.getElementById('output');
	React.render(content, target);
});
