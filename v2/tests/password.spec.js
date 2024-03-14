const { mount } = require('@vue/test-utils');
const { Password } = require('../js/components/password.js');

// Promise to wait a delay
const delay = time => new Promise(resolve => setTimeout(resolve, time));

describe('Password.vue', () => {
	let wrapper;
	beforeEach(() => {
		// Mount object
		wrapper = mount(Password)
	});

	it('convertToEmoji should return emoji code of char if its present in data when passed',async () => {
		var emoji;
		emoji =await wrapper.vm._convertToEmoji('p');
		expect(emoji).toStrictEqual('0x1F60E');

		emoji =await wrapper.vm._convertToEmoji('+');
		expect(emoji).toStrictEqual('');

		emoji =await wrapper.vm._convertToEmoji('8');
		expect(emoji).toStrictEqual('0x1F3BE');
	});

	it('clicking categories will add and remove classes and updates active category when passed', async () => {
		const emCls = '.emoji-category'
		expect(wrapper.findAll(emCls).length).toBe(3);

		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[0].classes('emoji-unselected')).toBe(false)
		expect(wrapper.findAll(emCls)[1].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[2].classes('emoji-selected')).toBe(false)
		expect(wrapper.find('.password-emojis').text()).toContain('i')
		expect(wrapper.findAll(emCls)[0].html()).toContain(String.fromCodePoint('0x1F436'))

		await wrapper.findAll(emCls)[1].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[0].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')
		expect(wrapper.find('.password-emojis').text()).toContain('m')
		expect(wrapper.findAll(emCls)[0].html()).toContain(String.fromCodePoint('0x1F436'))

		await wrapper.findAll(emCls)[2].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[0].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')
		expect(wrapper.find('.password-emojis').text()).toContain('1')
		expect(wrapper.findAll(emCls)[0].html()).toContain(String.fromCodePoint('0x1F60A'))

		await wrapper.findAll(emCls)[2].trigger('click')
		await wrapper.findAll(emCls)[2].trigger('click')
		await wrapper.findAll(emCls)[2].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[0].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-selected')
		expect(wrapper.find('.password-emojis').text()).toContain('T')
		expect(wrapper.findAll(emCls)[0].html()).toContain(String.fromCodePoint('0x26BD'))
		expect(wrapper.findAll(emCls)[2].html()).toContain(String.fromCodePoint('0x231A'))

		await wrapper.findAll(emCls)[1].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[0].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')
		expect(wrapper.find('.password-emojis').text()).toContain('L')

		await wrapper.findAll(emCls)[2].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-selected')
		
		await wrapper.findAll(emCls)[2].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-selected')
		
		await wrapper.findAll(emCls)[0].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[0].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')
		expect(wrapper.find('.password-emojis').text()).toContain('9')

		await wrapper.findAll(emCls)[1].trigger('click') // change nothing
		expect(wrapper.find('.password-emojis').text()).toContain('9')
		await wrapper.findAll(emCls)[0].trigger('click')
		await wrapper.findAll(emCls)[0].trigger('click')
		await wrapper.findAll(emCls)[0].trigger('click')

		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[1].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')

		expect(wrapper.find('.password-emojis').text()).toContain('h')
		await wrapper.findAll(emCls)[0].trigger('click')
		expect(wrapper.findAll(emCls)[0].classes()).toContain('emoji-selected')
		expect(wrapper.findAll(emCls)[1].classes()).toContain('emoji-unselected')
		expect(wrapper.findAll(emCls)[1].classes('emoji-selected')).toBe(false)
		expect(wrapper.findAll(emCls)[2].classes()).toContain('emoji-unselected')

		expect(wrapper.find('.password-emojis').text()).toContain('h')
	});

	it('set input value, cleared it on cancel button clicked and add emoji-flash accordingly when passed', async () => {
		expect(wrapper.find('.password-iconcancel').exists()).toBe(false)
		const inputElement= wrapper.find('input');
		await wrapper.findAll('.emoji')[3].trigger('click');
		expect(wrapper.findAll('.emoji')[3].classes()).toContain('emoji-flash');
		await delay(501);
		expect(wrapper.findAll('.emoji')[3].classes('emoji-flash')).toBe(false)
		expect(inputElement.element.value).toBe(String.fromCodePoint('0x1F434'));

		expect(wrapper.find('.password-iconcancel').exists()).toBe(true)

		await wrapper.find('.password-iconcancel').trigger('click')
		expect(inputElement.element.value).toBe('');

		expect(wrapper.find('.password-iconcancel').exists()).toBe(false)

		await wrapper.findAll('.emoji-icon')[3].trigger('click');
		expect(wrapper.findAll('.emoji')[3].classes()).toContain('emoji-flash');
		await delay(501);
		expect(wrapper.findAll('.emoji')[3].classes('emoji-flash')).toBe(false)
	});

	it('should take input from images as well as keyboard, update it on backspace and emit message when clicked enter when passed', async () => {
		const inputElement= wrapper.find('input');
		await wrapper.findAll('.emoji')[3].trigger('click');
		await wrapper.findAll('.emoji-category')[1].trigger('click')
		await wrapper.findAll('.emoji')[8].trigger('click');
		expect(inputElement.element.value).toBe(String.fromCodePoint('0x1F434')+String.fromCodePoint('0x1F622'));
		await inputElement.trigger('keydown', {
			key: 'w',
			keyCode: '87'
		})
		expect(inputElement.element.value).toBe(
			String.fromCodePoint('0x1F434')+
			String.fromCodePoint('0x1F622')+
			String.fromCodePoint('0x1F347')
		);
		await inputElement.trigger('keydown', {
			key: 'Shift',
			keyCode: '16'
		})
		expect(inputElement.element.value).toBe(
			String.fromCodePoint('0x1F434')+
			String.fromCodePoint('0x1F622')+
			String.fromCodePoint('0x1F347')
		);
		await wrapper.findAll('.emoji')[6].trigger('click');
		expect(inputElement.element.value).toBe(
			String.fromCodePoint('0x1F434')+
			String.fromCodePoint('0x1F622')+
			String.fromCodePoint('0x1F347')+
			String.fromCodePoint('0x1F614')
		);
		await inputElement.trigger('keydown', {
			key: 'Backspace',
			keyCode: '8'
		})
		expect(inputElement.element.value).toBe(
			String.fromCodePoint('0x1F434')+
			String.fromCodePoint('0x1F622')+
			String.fromCodePoint('0x1F347')
		);
		await inputElement.trigger('keydown', {
			key: 'Enter',
			keyCode: '13'
		})
		expect(wrapper.emitted()).toHaveProperty('passwordSet')
		expect(wrapper.emitted().passwordSet).toHaveLength(1)
		expect(wrapper.emitted().passwordSet[0]).toEqual(['dsw'])

		expect(wrapper.vm.passwordText).toBe('dsw');
		await inputElement.trigger('keydown', {
			key: 'Backspace',
			keyCode: '8'
		})
		expect(wrapper.vm.passwordText).toBe('ds');
		expect(wrapper.emitted().passwordSet).toHaveLength(1)
	});
})